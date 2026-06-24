import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Opens the Stripe Customer Portal so the user can upgrade, downgrade, or cancel
// WITHOUT us building any billing UI or touching card data.
export async function POST(req: NextRequest) {
  // ⚠️ PRODUCTION (STEM): don't accept customerId from the client (IDOR — a user
  // could open another customer's billing portal). Look up the authenticated
  // user's customer_id from the subscriptions table instead.
  const { customerId } = await req.json();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
