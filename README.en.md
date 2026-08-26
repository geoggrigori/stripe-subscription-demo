<!-- ══════════════════════════ TITLE ══════════════════════════ -->
<div align="center">
  <img src="docs/title-banner.svg" width="100%" alt="Stripe Subscription Demo"/>
</div>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-555555?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-1987F0?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-555555?style=for-the-badge" alt="Español"/></a>
</div>

<h1 align="center">Stripe Subscription Demo</h1>
<p align="center"><em>A minimal but production-shaped Stripe subscription flow for a two-tier mentorship platform</em></p>
<p align="center"><strong>Checkout → webhook (source of truth) → Supabase → status-gated access</strong></p>

<div align="center">
<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="nextjs"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="ts"/>
<img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="stripe"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="supabase"/>
<img src="https://img.shields.io/badge/License-MIT-2E7D32?style=flat-square" alt="license"/>
</div>

<div align="center">
<a href="#about"><img src="https://img.shields.io/badge/▸_ABOUT-1987F0?style=for-the-badge" alt="about"/></a>
<a href="#architecture"><img src="https://img.shields.io/badge/▸_ARCHITECTURE-000000?style=for-the-badge" alt="architecture"/></a>
<a href="#setup"><img src="https://img.shields.io/badge/▸_SETUP-1987F0?style=for-the-badge" alt="setup"/></a>
</div>

<br/>

> 🔑 **The webhook is the source of truth.** The app never trusts the client for entitlement — only the `subscriptions` row that the webhook keeps in sync.

## About

A minimal but production-shaped Stripe **subscription** flow, built to mirror a two-tier mentorship platform (`Group` + `1:1 Premium`):

- **Stripe Checkout** in `subscription` mode.
- **Webhook** as the single source of truth → synced into **Supabase**.
- **Stripe Customer Portal** for upgrade/downgrade/cancel (no custom billing UI).

## Architecture

```
Pricing page ──POST /api/checkout──▶ Stripe Checkout ──▶ payment
                                                           │
        Supabase ◀──upsert── /api/webhook ◀──events── Stripe
            │
   GET /api/subscription ──▶ app gates access by status
```

A user can close the browser right after paying — so the success redirect is not reliable. The webhook fires regardless, and the subscription is re-fetched from Stripe on every relevant event, making the sync idempotent and order-independent.

## Setup

1. `npm install`
2. Fill `.env.local` (Stripe test keys, price IDs, Supabase keys).
3. In Supabase: run `supabase-schema.sql`.
4. In Stripe (test mode): create two recurring Products → put their price IDs in `.env.local`.
5. Run the app: `npm run dev`
6. Forward webhooks locally:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   (copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`)
7. Subscribe with test card `4242 4242 4242 4242`, any future date, any CVC.

## License

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Built by <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
