// Stripe Checkout — base44/functions/create-stripe-checkout/entry.ts
//
// Creates a Stripe Checkout Session (test or live mode, depending on the key provided)
// for gym memberships, digital memberships, class packs, and personal training.
// The buyer is redirected to Stripe's hosted checkout page. After payment, the stripe-webhook
// function fulfills the order (activates members, generates QR credentials, etc.).
//
// PUBLIC: a buyer does NOT need to be logged in to check out. If they are signed in,
// we record their app-user id as the fulfillment target; otherwise the webhook grants
// by the buyer's email (collected by Stripe on the checkout page).
//
// SECURITY: STRIPE_SECRET_KEY is read server-side from app secrets and NEVER sent to
// the client. The client only receives { redirectUrl } to redirect the buyer.

import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

const STRIPE_API = "https://api.stripe.com/v1";

// Resolve the app's public base URL for Stripe's success/cancel redirect links.
// Uses the platform-injected header (server-set, correct behind custom domains), then the
// app URL secret already configured for Base44 Payments. Never falls back to request Origin.
function resolveAppUrl(req) {
  return (
    req.headers.get("x-base44-app-url") ||
    Deno.env.get("WIX_CHECKOUT_APP_URL") ||
    ""
  );
}

// Flatten a nested object into Stripe's form-encoded bracket format:
// { line_items: [{ price_data: { currency: "usd" } }] }
// → "line_items[0][price_data][currency]=usd"
function toStripeForm(obj, prefix = "") {
  const parts = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          parts.push(...toStripeForm(item, `${fullKey}[${i}]`));
        } else {
          parts.push(`${fullKey}[${i}]=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === "object") {
      parts.push(...toStripeForm(value, fullKey));
    } else if (typeof value === "boolean") {
      parts.push(`${fullKey}=${value}`);
    } else {
      parts.push(`${fullKey}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts;
}

// Authoritative product catalog — prices resolved server-side, never trusted from the client.
// Same product IDs as the Base44 Payments create-checkout function for full feature parity.
// Stripe uses cents (integer); we convert from major-unit strings.
const PRODUCTS = {
  // Gym memberships (recurring subscriptions)
  "gym-monthly": { name: "Monthly Gym Membership", price: "49.00", currency: "usd", recurring: { interval: "month" } },
  "gym-premium": { name: "Premium Membership", price: "99.00", currency: "usd", recurring: { interval: "month" } },
  "gym-pt": { name: "Personal Training Membership", price: "199.00", currency: "usd", recurring: { interval: "month" } },
  "gym-founding": { name: "Founding Member", price: "79.00", currency: "usd", recurring: { interval: "month" } },
  "gym-day-pass": { name: "Day Pass", price: "20.00", currency: "usd" },
  "gym-trial": { name: "Trial Membership", price: "49.00", currency: "usd", recurring: { interval: "month" }, trialDays: 7 },

  // Digital memberships (recurring subscriptions)
  "membership-monthly": { name: "High Frequency — Monthly All-Access", price: "49.00", currency: "usd", recurring: { interval: "month" } },
  "membership-annual": { name: "High Frequency — Annual All-Access", price: "499.00", currency: "usd", recurring: { interval: "year" } },
  "membership-elite": { name: "High Frequency — Elite Annual", price: "899.00", currency: "usd", recurring: { interval: "year" } },

  // Class packs (one-time)
  "class-single": { name: "Single Class Drop-in", price: "25.00", currency: "usd" },
  "class-5pack": { name: "5-Class Pack", price: "110.00", currency: "usd" },
  "class-10pack": { name: "10-Class Pack", price: "200.00", currency: "usd" },

  // Personal training (one-time)
  "pt-single": { name: "1-on-1 PT — Single Session", price: "120.00", currency: "usd" },
  "pt-4pack": { name: "1-on-1 PT — 4 Sessions", price: "440.00", currency: "usd" },
  "pt-8pack": { name: "1-on-1 PT — 8 Sessions", price: "800.00", currency: "usd" },
};

export default async function (req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    // Read per request: if Stripe is disconnected, a warm isolate won't keep old credentials.
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      console.error("create-stripe-checkout: STRIPE_SECRET_KEY not set");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500 });
    }

    const appUrl = resolveAppUrl(req);
    if (!appUrl) {
      console.error("create-stripe-checkout: no app URL (header and fallback both empty)");
      return new Response(JSON.stringify({ error: "App not configured" }), { status: 500 });
    }

    const base44 = createClientFromRequest(req);

    // Capture the buyer's app-user id IF signed in — but never REQUIRE it.
    let appUser = null;
    try {
      appUser = await base44.auth.me();
    } catch (_) {
      appUser = null;
    }

    const body = await req.json().catch(() => ({}));
    const productId = String(body.productId ?? "");
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));

    const product = PRODUCTS[productId];
    if (!product) {
      return new Response(JSON.stringify({ error: "Unknown product" }), { status: 400 });
    }

    const isSubscription = !!product.recurring;
    const mode = isSubscription ? "subscription" : "payment";
    const unitAmount = Math.round(parseFloat(product.price) * 100);

    const lineItem = {
      quantity,
      price_data: {
        currency: product.currency,
        product_data: { name: product.name },
        unit_amount: unitAmount,
        ...(product.recurring ? { recurring: product.recurring } : {}),
      },
    };

    const sessionParams = {
      mode,
      line_items: [lineItem],
      success_url: `${appUrl}/ThankYou`,
      cancel_url: `${appUrl}/membership`,
      // Metadata travels with the session and is available in the webhook — this is how
      // we know which product and which app user to fulfill after payment.
      metadata: {
        appUserId: appUser?.id || "",
        productId,
      },
      ...(appUser?.email ? { customer_email: appUser.email } : {}),
      ...(product.trialDays
        ? { subscription_data: { trial_period_days: product.trialDays } }
        : {}),
    };

    const formBody = toStripeForm(sessionParams).join("&");

    const stripeRes = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    if (!stripeRes.ok) {
      const errText = await stripeRes.text();
      console.error("create-stripe-checkout: Stripe API error", {
        status: stripeRes.status,
        errText,
      });
      return new Response(JSON.stringify({ error: "Could not start checkout" }), { status: 502 });
    }

    const session = await stripeRes.json();

    if (!session.id || !session.url) {
      console.error("create-stripe-checkout: missing session id/url", session);
      return new Response(JSON.stringify({ error: "Could not start checkout" }), { status: 502 });
    }

    // Persist the join key BEFORE redirecting. The stripe-webhook resolves the purchase
    // by this checkout session id. asServiceRole so a buyer can't forge a paid purchase.
    await base44.asServiceRole.entities.Base44Purchase.create({
      checkoutSessionId: session.id,
      status: "pending",
      appUserId: appUser?.id ?? null,
      buyerEmail: appUser?.email ?? null,
      productId,
      productName: product.name,
      quantity,
      amount: (parseFloat(product.price) * quantity).toFixed(2),
      currency: product.currency.toUpperCase(),
    });

    return new Response(JSON.stringify({ redirectUrl: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-stripe-checkout: unhandled error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}