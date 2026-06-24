import Stripe from "stripe";

// Server-side Stripe client. The secret key NEVER reaches the browser.
// We omit apiVersion so the SDK uses the version pinned to the installed package.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
