import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { syncSubscription } from "@/lib/sync-subscription";

// Stripe needs the RAW request body to verify the signature, so we read it as text.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Each of these events means "this user's access may have changed" — so we
  // re-fetch the subscription from Stripe and mirror it into Supabase.
  switch (event.type) {
    // The customer just finished Checkout. The subscription now exists, so we
    // record it for the first time.
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        await syncSubscription(session.subscription as string);
      }
      break;
    }

    // created  -> first time the subscription object appears
    // updated  -> plan change, renewal, trial ending, going past_due, etc.
    // deleted  -> cancellation took effect
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription.id);
      break;
    }

    // A renewal payment failed: the subscription flips to past_due / unpaid, so
    // we re-sync to revoke access until they fix their card.
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = (invoice as unknown as { subscription?: string }).subscription;
      if (subId) {
        await syncSubscription(subId);
      }
      break;
    }

    default:
      // Every other event type is ignored — we only care about access changes.
      break;
  }

  return NextResponse.json({ received: true });
}
