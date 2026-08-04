// Stripe Webhook — base44/functions/stripe-webhook/entry.ts
//
// Receives Stripe webhook events, verifies the HMAC-SHA256 signature using the
// STRIPE_WEBHOOK_SECRET, and fulfills or revokes purchases — same logic as the
// Base44 Payments webhook:
//   - checkout.session.completed → activate member, generate QR credential, mark paid
//   - customer.subscription.deleted → revoke access, deactivate QR, mark canceled
//
// SECURITY: STRIPE_WEBHOOK_SECRET is read server-side from app secrets. The signature
// is verified before any fulfillment runs — an unverified request is rejected with 401.

import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

// Verify the Stripe-Signature header using the Web Crypto API (no external dependency).
// Stripe signs `${timestamp}.${rawBody}` with HMAC-SHA256 using the webhook secret.
async function verifyStripeSignature(payload, sigHeader, secret) {
  const parts = {};
  for (const part of sigHeader.split(",")) {
    const [k, v] = part.trim().split("=");
    if (k) parts[k] = v;
  }

  const timestamp = parts["t"];
  const signature = parts["v1"];

  if (!timestamp || !signature) {
    throw new Error("Missing signature components");
  }

  // Reject replayed events older than 5 minutes.
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (age > 300) {
    throw new Error(`Timestamp too old (${age}s)`);
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload)
  );

  const computed = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (computed !== signature) {
    throw new Error("Signature mismatch");
  }
}

export default async function (req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error("stripe-webhook: secrets not configured");
      return new Response("Webhook not configured", { status: 500 });
    }

    const sigHeader = req.headers.get("stripe-signature");
    if (!sigHeader) {
      return new Response("Missing signature", { status: 401 });
    }

    // Raw body is required for signature verification — parsing to JSON first
    // would change the byte sequence and break the HMAC check.
    const rawBody = await req.text();

    try {
      await verifyStripeSignature(rawBody, sigHeader, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("stripe-webhook: signature verification failed", err.message);
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole; // No end user is authenticated on a webhook call.

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(db, event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(db, event.data.object);
        break;
      default:
        console.log(`stripe-webhook: ignoring event ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("stripe-webhook: unhandled error", err);
    return new Response("Internal error", { status: 500 });
  }
}

// Fulfill a successful checkout — mirror of the Base44 Payments ORDER_APPROVED handler.
async function handleCheckoutCompleted(db, session) {
  const checkoutId = session.id;
  const subscriptionId = session.subscription || null;
  const customerId = session.customer || null;
  const buyerEmail =
    session.customer_details?.email || session.customer_email || null;
  const productId = session.metadata?.productId || "";
  const appUserId = session.metadata?.appUserId || null;

  if (!checkoutId) {
    console.error("stripe-webhook: checkout.session.completed missing id");
    return;
  }

  // Resolve the pending purchase created by create-stripe-checkout (join key: checkoutSessionId).
  const matches = await db.entities.Base44Purchase.filter({
    checkoutSessionId: checkoutId,
  });
  const purchase = matches?.[0];

  if (!purchase) {
    console.warn("stripe-webhook: no Base44Purchase for checkoutId", checkoutId);
    return;
  }

  // IDEMPOTENCY + terminal states: Stripe can deliver events more than once.
  if (purchase.status === "paid" || purchase.status === "canceled") {
    console.log("stripe-webhook: purchase already terminal", purchase.status);
    return;
  }

  // ===== FULFILLMENT (same logic as payments-webhook) =====
  // Digital membership plans: set the user's plan field.
  if (appUserId && productId.startsWith("membership-")) {
    try {
      await db.entities.User.update(appUserId, { plan: productId });
    } catch (err) {
      console.error("stripe-webhook: failed to grant membership plan", { err });
      throw err;
    }
  }

  // Gym membership fulfillment: activate member, generate QR credential, record subscription.
  if (appUserId && productId.startsWith("gym-")) {
    try {
      const members = await db.entities.Members.filter({ user_id: appUserId });
      const member = members?.[0];
      if (member) {
        const now = new Date().toISOString();
        const memberNumber =
          member.member_number || `HF-${Date.now().toString(36).toUpperCase()}`;
        await db.entities.Members.update(member.id, {
          membership_status: "active",
          access_status: "approved",
          membership_start_date: now,
          stripe_subscription_id:
            subscriptionId ?? member.stripe_subscription_id ?? null,
          stripe_customer_id: customerId ?? member.stripe_customer_id ?? null,
          member_number: memberNumber,
        });

        // Create QR access credential (idempotent: check existing first)
        const existingCreds = await db.entities.AccessCredentials.filter({
          member_id: member.id,
          credential_type: "qr_pass",
        });
        if (!existingCreds?.length) {
          await db.entities.AccessCredentials.create({
            member_id: member.id,
            credential_type: "qr_pass",
            credential_token: memberNumber,
            active: true,
            issued_at: now,
          });
        }

        // Record subscription (idempotent)
        if (subscriptionId) {
          const existingSubs = await db.entities.Subscriptions.filter({
            stripe_subscription_id: subscriptionId,
          });
          if (!existingSubs?.length) {
            await db.entities.Subscriptions.create({
              member_id: member.id,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: productId,
              status: "active",
              current_period_start: now,
            });
          }
        }
      }
    } catch (err) {
      console.error("stripe-webhook: failed to fulfill gym membership", { err });
      throw err;
    }
  }
  // ===== END FULFILLMENT =====

  // Mark paid LAST, so "paid" always implies fulfillment completed.
  await db.entities.Base44Purchase.update(purchase.id, {
    status: "paid",
    orderId: checkoutId,
    subscriptionId: subscriptionId ?? purchase.subscriptionId ?? null,
    buyerEmail: buyerEmail ?? purchase.buyerEmail ?? null,
    paidAt: new Date().toISOString(),
  });

  console.log("stripe-webhook: fulfilled purchase", purchase.id);
}

// Revoke access when a subscription is canceled — mirror of the Base44 Payments
// SUBSCRIPTION_CANCELED/EXPIRED handler.
async function handleSubscriptionDeleted(db, subscription) {
  const subscriptionId = subscription.id;

  if (!subscriptionId) {
    console.error("stripe-webhook: subscription.deleted missing id");
    return;
  }

  const matches = await db.entities.Base44Purchase.filter({ subscriptionId });
  const purchase = matches?.[0];

  if (!purchase) {
    console.warn("stripe-webhook: no Purchase for subscription", subscriptionId);
    return;
  }

  if (purchase.status === "canceled") {
    return; // Idempotent
  }

  // ===== REVOCATION (same logic as payments-webhook) =====
  const { appUserId, productId } = purchase;

  if (appUserId && productId?.startsWith("membership-")) {
    try {
      await db.entities.User.update(appUserId, { plan: null });
    } catch (err) {
      console.error("stripe-webhook: failed to revoke membership plan", { err });
      throw err;
    }
  }

  if (appUserId && productId?.startsWith("gym-")) {
    try {
      const members = await db.entities.Members.filter({ user_id: appUserId });
      const member = members?.[0];
      if (member) {
        await db.entities.Members.update(member.id, {
          membership_status: "canceled",
          access_status: "denied",
        });
        const creds = await db.entities.AccessCredentials.filter({
          member_id: member.id,
          credential_type: "qr_pass",
          active: true,
        });
        for (const cred of (creds ?? [])) {
          await db.entities.AccessCredentials.update(cred.id, { active: false });
        }
        const subs = await db.entities.Subscriptions.filter({
          stripe_subscription_id: subscriptionId,
        });
        if (subs?.[0]) {
          await db.entities.Subscriptions.update(subs[0].id, {
            status: "canceled",
          });
        }
      }
    } catch (err) {
      console.error("stripe-webhook: failed to revoke gym membership", { err });
      throw err;
    }
  }
  // ===== END REVOCATION =====

  // Mark canceled LAST, so "canceled" always implies access was actually revoked.
  await db.entities.Base44Purchase.update(purchase.id, {
    status: "canceled",
    canceledAt: new Date().toISOString(),
  });

  console.log("stripe-webhook: revoked subscription", purchase.id);
}