import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * The single source of truth.
 *
 * Instead of trusting whatever a webhook event *says*, we re-fetch the
 * subscription straight from Stripe and mirror its current state into Supabase.
 * This makes the sync idempotent: no matter which event fires (or fires twice,
 * or out of order), the row in our DB always reflects Stripe's reality.
 */
export async function syncSubscription(subscriptionId: string) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);

  const item = sub.items.data[0];
  // current_period_end lives on the subscription item in recent API versions,
  // and on the subscription itself in older ones — handle both.
  const periodEndUnix =
    item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;

  await supabaseAdmin.from("subscriptions").upsert(
    {
      id: sub.id,
      user_id: sub.metadata.userId ?? null,
      customer_id: sub.customer as string,
      status: sub.status, // active | trialing | past_due | canceled | unpaid | ...
      price_id: item?.price.id ?? null,
      current_period_end: periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
    },
    { onConflict: "id" }
  );
}
