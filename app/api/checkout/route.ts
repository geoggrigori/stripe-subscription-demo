import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Creates a Stripe Checkout Session in "subscription" mode and returns its URL.
// We attach userId as metadata so the webhook can link the subscription back
// to our user.
export async function POST(req: NextRequest) {
  // ⚠️ PRODUCTION (STEM): never trust client-supplied identity. Derive userId &
  // email from the server-side Supabase auth session — taking them from the body
  // lets anyone mint a checkout under someone else's account. Safe here only
  // because the demo has no auth and a single hardcoded user.
  const { priceId, userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    subscription_data: { metadata: { userId } },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
