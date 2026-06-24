# Stripe Subscriptions Demo

A minimal but production-shaped Stripe **subscription** flow, built to mirror a
two-tier mentorship platform (`Group` + `1:1 Premium`):

- **Next.js 16 (App Router) + TypeScript**
- **Stripe Checkout** in `subscription` mode
- **Webhook** as the single source of truth → synced into **Supabase**
- **Stripe Customer Portal** for upgrade / downgrade / cancel (no custom billing UI)

## Architecture

```
Pricing page ──POST /api/checkout──▶ Stripe Checkout ──▶ payment
                                                           │
        Supabase ◀──upsert── /api/webhook ◀──events── Stripe
            │
   GET /api/subscription ──▶ app gates access by status
```

The app **never trusts the client** for entitlement: access is decided from the
`subscriptions` row that the webhook keeps in sync with Stripe.

## Setup

1. `npm install`
2. Fill `.env.local` (Stripe test keys, price IDs, Supabase keys).
3. In Supabase: run `supabase-schema.sql`.
4. In Stripe (test mode): create two recurring Products → put their price IDs in `.env.local`.
5. Run the app: `npm run dev`
6. Forward webhooks locally:
   `stripe listen --forward-to localhost:3000/api/webhook`
   (copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`)
7. Subscribe with test card `4242 4242 4242 4242`, any future date, any CVC.

## Why webhooks are the source of truth

A user can close the browser right after paying — so the success redirect is not
reliable. The webhook fires regardless, and we re-fetch the subscription from
Stripe on every relevant event, making the sync idempotent and order-independent.
