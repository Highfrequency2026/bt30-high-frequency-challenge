// Stripe Webhook — base44/functions/stripe-webhook/entry.ts
//
// Secure Stripe webhook endpoint. Receives Stripe events, verifies the HMAC-SHA256
// signature, prevents duplicate processing via event-ID storage, and manages the full
// gym-membership lifecycle:
//
//   checkout.session.completed       → Record the completed Checkout Session
//   invoice.paid                      → Activate or continue membership access
//   invoice.payment_failed            → Set Past Due, notify member, begin grace period
//   customer.subscription.created     → Record subscription creation
//   customer.subscription.updated     → Sync subscription status changes
//   customer.subscription.deleted     → Set Canceled/Expired, disable access credential
//
// SECURITY: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are read server-side from app
// secrets (Base44 Secrets & Keys). They NEVER appear in frontend code, page components,
// browser storage, URL parameters, public entities, logs, or error messages.

import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

const GRACE_PERIOD_DAYS = 7;

// ===== SIGNATURE VERIFICATION (Web Crypto API — no external dependency) =====
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
    throw new Error("Timestamp too old");
  }

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
    encoder.encode(`${timestamp}.${payload}`)
  );
  const computed = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (computed !== signature) {
    throw new Error("Signature mismatch");
  }
}

// ===== IDEMPOTENCY =====
// Store each Stripe event ID to prevent duplicate processing.
async function isEventProcessed(db, eventId) {
  const existing = await db.entities.StripeEvents.filter({ event_id: eventId });
  return !!(existing && existing.length > 0);
}

async function markEventProcessed(db, eventId, eventType) {
  await db.entities.StripeEvents.create({
    event_id: eventId,
    event_type: eventType,
    processed_at: new Date().toISOString(),
  });
}

// ===== HELPERS =====

function toIsoDate(stripeTimestamp) {
  return stripeTimestamp ? new Date(stripeTimestamp * 1000).toISOString() : undefined;
}

// Find a member by their Stripe subscription ID; fall back to customer ID.
async function findMemberBySubscription(db, subscriptionId, customerId) {
  if (subscriptionId) {
    const bySub = await db.entities.Members.filter({ stripe_subscription_id: subscriptionId });
    if (bySub?.[0]) return bySub[0];
  }
  if (customerId) {
    const byCust = await db.entities.Members.filter({ stripe_customer_id: customerId });
    if (byCust?.[0]) return byCust[0];
  }
  return null;
}

async function findMemberByUserId(db, userId) {
  const members = await db.entities.Members.filter({ user_id: userId });
  return members?.[0] || null;
}

// Check that the member has completed all onboarding requirements before
// granting or restoring facility access.
function isMemberReady(member) {
  return member.waiver_status === "signed" && !!member.photo_url;
}

// Activate or restore a member's access — ONLY if waiver + photo are complete.
async function activateMemberAccess(db, member) {
  if (!isMemberReady(member)) {
    return false;
  }
  const now = new Date().toISOString();
  const memberNumber = member.member_number || `HF-${Date.now().toString(36).toUpperCase()}`;

  await db.entities.Members.update(member.id, {
    membership_status: "active",
    access_status: "approved",
    membership_start_date: member.membership_start_date || now,
    member_number: memberNumber,
  });

  // Create or re-enable QR access credential (idempotent).
  const existingCreds = await db.entities.AccessCredentials.filter({
    member_id: member.id,
    credential_type: "qr_pass",
  });
  if (existingCreds?.length) {
    for (const cred of existingCreds) {
      if (!cred.active) {
        await db.entities.AccessCredentials.update(cred.id, { active: true, issued_at: now });
      }
    }
  } else {
    await db.entities.AccessCredentials.create({
      member_id: member.id,
      credential_type: "qr_pass",
      credential_token: memberNumber,
      active: true,
      issued_at: now,
    });
  }
  return true;
}

async function disableAccessCredential(db, memberId) {
  const creds = await db.entities.AccessCredentials.filter({
    member_id: memberId,
    credential_type: "qr_pass",
    active: true,
  });
  for (const cred of (creds || [])) {
    await db.entities.AccessCredentials.update(cred.id, { active: false });
  }
}

// Update a Subscriptions record, filtering out undefined values.
async function updateSubscription(db, subscriptionId, updates) {
  const subs = await db.entities.Subscriptions.filter({ stripe_subscription_id: subscriptionId });
  if (!subs?.[0]) return;
  const clean = Object.fromEntries(
    Object.entries(updates).filter(([, v]) => v !== undefined)
  );
  await db.entities.Subscriptions.update(subs[0].id, clean);
}

// ===== EVENT HANDLERS =====

// checkout.session.completed — Record the completed Checkout Session ONLY.
// For subscriptions: store IDs but do NOT activate (wait for invoice.paid).
// For one-time payments: fulfill immediately (no invoice event will follow).
// For digital memberships: grant the digital plan immediately.
async function handleCheckoutCompleted(db, session) {
  const checkoutId = session.id;
  const subscriptionId = session.subscription || null;
  const customerId = session.customer || null;
  const buyerEmail = session.customer_details?.email || session.customer_email || null;
  const productId = session.metadata?.productId || "";
  const appUserId = session.metadata?.appUserId || null;

  // Mark the Base44Purchase as paid (idempotent — skip if already terminal).
  const matches = await db.entities.Base44Purchase.filter({ checkoutSessionId: checkoutId });
  const purchase = matches?.[0];
  if (purchase && purchase.status !== "paid" && purchase.status !== "canceled") {
    await db.entities.Base44Purchase.update(purchase.id, {
      status: "paid",
      orderId: checkoutId,
      subscriptionId: subscriptionId ?? purchase.subscriptionId ?? null,
      buyerEmail: buyerEmail ?? purchase.buyerEmail ?? null,
      paidAt: new Date().toISOString(),
    });
  }

  // Digital membership plans: grant immediately (app access, no gym onboarding required).
  if (appUserId && productId.startsWith("membership-")) {
    try {
      await db.entities.User.update(appUserId, { plan: productId });
    } catch (err) {
      console.error("stripe-webhook: failed to grant digital plan", err.message);
    }
    return;
  }

  // Gym memberships: store the subscription + customer IDs on the Member record
  // and create a Subscriptions record. Do NOT activate — wait for invoice.paid.
  if (appUserId && productId.startsWith("gym-")) {
    const member = await findMemberByUserId(db, appUserId);
    if (member) {
      await db.entities.Members.update(member.id, {
        stripe_subscription_id: subscriptionId ?? member.stripe_subscription_id ?? null,
        stripe_customer_id: customerId ?? member.stripe_customer_id ?? null,
      });

      // Create a Subscriptions record (idempotent).
      if (subscriptionId) {
        const existingSubs = await db.entities.Subscriptions.filter({ stripe_subscription_id: subscriptionId });
        if (!existingSubs?.length) {
          await db.entities.Subscriptions.create({
            member_id: member.id,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            stripe_price_id: productId,
            status: session.mode === "subscription" ? "trialing" : "active",
            current_period_start: new Date().toISOString(),
          });
        }
      }

      // One-time gym purchase (day pass): fulfill immediately since no invoice follows.
      if (session.mode === "payment" && session.payment_status === "paid") {
        await activateMemberAccess(db, member);
      }
    }
  }
}

// invoice.paid — Activate or continue membership access using the verified
// subscription billing status. Restores access only when onboarding is complete.
async function handleInvoicePaid(db, invoice) {
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;

  const member = await findMemberBySubscription(db, subscriptionId, customerId);
  if (!member) {
    console.warn("stripe-webhook: invoice.paid — no member for subscription", subscriptionId);
    throw new Error("Member not found for subscription");
  }

  const now = new Date().toISOString();

  // Set billing status to Current.
  await updateSubscription(db, subscriptionId, {
    status: "active",
    last_payment_status: "paid",
    last_payment_date: now,
    current_period_start: toIsoDate(invoice.period_start),
    current_period_end: toIsoDate(invoice.period_end),
  });

  // If already active, billing is simply continued — nothing more to do.
  if (member.membership_status === "active") return;

  // Activate or restore access — only if waiver + photo are complete.
  const activated = await activateMemberAccess(db, member);
  if (!activated) {
    console.log("stripe-webhook: invoice.paid — member not ready (waiver/photo incomplete)", member.id);
  }
}

// invoice.payment_failed — Set billing Past Due, notify the member, and begin
// the grace period. The daily membership-automations function will suspend
// access and disable credentials after GRACE_PERIOD_DAYS.
async function handleInvoicePaymentFailed(db, invoice) {
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;

  const member = await findMemberBySubscription(db, subscriptionId, customerId);
  if (!member) {
    console.warn("stripe-webhook: invoice.payment_failed — no member for subscription", subscriptionId);
    throw new Error("Member not found for subscription");
  }

  const now = new Date().toISOString();

  // Set billing status to Past Due.
  await db.entities.Members.update(member.id, {
    membership_status: "past_due",
  });

  await updateSubscription(db, subscriptionId, {
    status: "past_due",
    last_payment_status: "failed",
    last_payment_date: now,
  });

  // Notify the member (registered app users only — SendEmail).
  try {
    await db.integrations.Core.SendEmail({
      to: member.email,
      subject: "Payment Failed — Action Required",
      body: `Hi ${member.first_name},\n\nYour High Frequency membership payment could not be processed. Please update your payment method as soon as possible.\n\nIf payment is not received within ${GRACE_PERIOD_DAYS} days, your facility access will be suspended.\n\nThank you,\nThe High Frequency Team`,
    });
  } catch (err) {
    console.error("stripe-webhook: failed to send payment-failed email", err.message);
  }

  // Grace period begins — the daily membership-automations function will:
  //   • Send a reminder email each day
  //   • Suspend membership and disable QR credentials after 7 days
}

// customer.subscription.created — Record subscription creation (no action needed).
async function handleSubscriptionCreated(db, subscription) {
  console.log("stripe-webhook: subscription created", subscription.id);
}

// customer.subscription.updated — Sync the Stripe subscription status to the
// local membership and billing records.
async function handleSubscriptionUpdated(db, subscription) {
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const customerId = subscription.customer;

  const member = await findMemberBySubscription(db, subscriptionId, customerId);
  if (!member) {
    console.warn("stripe-webhook: subscription.updated — no member for subscription", subscriptionId);
    return;
  }

  switch (status) {
    case "active": {
      await updateSubscription(db, subscriptionId, {
        status: "active",
        current_period_start: toIsoDate(subscription.current_period_start),
        current_period_end: toIsoDate(subscription.current_period_end),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
      });
      // Restore access if the member was past_due or pending.
      if (member.membership_status === "pending" || member.membership_status === "past_due" || member.membership_status === "suspended") {
        await activateMemberAccess(db, member);
      }
      break;
    }
    case "past_due": {
      await db.entities.Members.update(member.id, { membership_status: "past_due" });
      await updateSubscription(db, subscriptionId, {
        status: "past_due",
        last_payment_status: "failed",
      });
      break;
    }
    case "canceled":
    case "unpaid": {
      await handleSubscriptionDeleted(db, subscription);
      break;
    }
    case "trialing": {
      await updateSubscription(db, subscriptionId, { status: "trialing" });
      // During a trial, activate access if onboarding is complete.
      if (member.membership_status === "pending") {
        await activateMemberAccess(db, member);
      }
      break;
    }
    default:
      console.log("stripe-webhook: unhandled subscription status", status);
  }
}

// customer.subscription.deleted — Set membership to Canceled or Expired and
// disable the member's gym-access credential.
async function handleSubscriptionDeleted(db, subscription) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer;

  const member = await findMemberBySubscription(db, subscriptionId, customerId);
  if (!member) {
    console.warn("stripe-webhook: subscription.deleted — no member for subscription", subscriptionId);
    return;
  }

  // Determine whether the subscription expired naturally or was canceled early.
  // If ended_at ≈ current_period_end, it ran all billing cycles → Expired.
  // Otherwise it was ended early → Canceled.
  const endedAt = subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date();
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null;
  const isExpired = periodEnd && Math.abs(endedAt.getTime() - periodEnd.getTime()) < 60000;
  const membershipStatus = isExpired ? "expired" : "canceled";

  await db.entities.Members.update(member.id, {
    membership_status: membershipStatus,
    access_status: "denied",
  });

  await disableAccessCredential(db, member.id);

  await updateSubscription(db, subscriptionId, {
    status: membershipStatus,
    cancel_at_period_end: false,
  });

  // Revoke digital membership plan if applicable.
  if (member.user_id) {
    const productId = subscription.metadata?.productId || "";
    if (productId.startsWith("membership-")) {
      try {
        await db.entities.User.update(member.user_id, { plan: null });
      } catch (err) {
        console.error("stripe-webhook: failed to revoke digital plan", err.message);
      }
    }
  }
}

// ===== MAIN HANDLER =====
export default async function (req) {
  // 1. Accept POST requests from Stripe.
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Read secrets server-side — never logged, never returned to the client.
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

    // 2. Read the raw request body BEFORE parsing (signature is computed over raw bytes).
    const rawBody = await req.text();

    // 3 & 4. Verify the Stripe-Signature header; reject unverified requests.
    try {
      await verifyStripeSignature(rawBody, sigHeader, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("stripe-webhook: signature verification failed", err.message);
      return new Response("Invalid signature", { status: 401 });
    }

    // Parse the verified event.
    const event = JSON.parse(rawBody);
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole;

    // 6. Prevent duplicate processing — check if this event ID was already handled.
    if (event.id) {
      const alreadyProcessed = await isEventProcessed(db, event.id);
      if (alreadyProcessed) {
        console.log("stripe-webhook: event already processed", event.id);
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Route to the appropriate handler.
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(db, event.data.object);
          break;
        case "invoice.paid":
          await handleInvoicePaid(db, event.data.object);
          break;
        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(db, event.data.object);
          break;
        case "customer.subscription.created":
          await handleSubscriptionCreated(db, event.data.object);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(db, event.data.object);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(db, event.data.object);
          break;
        default:
          console.log("stripe-webhook: ignoring event", event.type);
      }
    } catch (handlerErr) {
      // 7. Log processing errors without exposing secrets. Do NOT mark the event
      //    as processed — return 500 so Stripe retries.
      console.error("stripe-webhook: handler error for event", event.id, handlerErr.message);
      return new Response("Processing error", { status: 500 });
    }

    // Mark the event as processed (idempotency) so duplicates are skipped.
    if (event.id) {
      try {
        await markEventProcessed(db, event.id, event.type);
      } catch (err) {
        // Non-fatal — the event was processed; duplicate delivery would be caught
        // by the handler's own idempotency checks (terminal-state guards).
        console.error("stripe-webhook: failed to store event ID", event.id, err.message);
      }
    }

    // 5. Return a successful 2xx response promptly after valid events are received.
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Log without exposing any secret values.
    console.error("stripe-webhook: unhandled error", err.message);
    return new Response("Internal error", { status: 500 });
  }
}