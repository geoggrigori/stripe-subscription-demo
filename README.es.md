<!-- ══════════════════════════ PORTADA ══════════════════════════ -->
<div align="center">
  <img src="docs/title-banner.svg" width="100%" alt="Stripe Subscription Demo"/>
</div>

<br/>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-555555?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-555555?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-1987F0?style=for-the-badge" alt="Español"/></a>
</div>

<br/>

<h1 align="center">Stripe Subscription Demo</h1>
<p align="center"><em>Un flujo de suscripción Stripe mínimo pero con forma de producción, para una plataforma de mentoría en dos niveles</em></p>
<p align="center"><strong>Checkout → webhook (fuente de la verdad) → Supabase → acceso controlado por status</strong></p>

<div align="center">
<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="nextjs"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="ts"/>
<img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="stripe"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="supabase"/>
<img src="https://img.shields.io/badge/License-MIT-2E7D32?style=flat-square" alt="license"/>
</div>

<div align="center">
<a href="#acerca-de"><img src="https://img.shields.io/badge/▸_ACERCA_DE-1987F0?style=for-the-badge" alt="acerca"/></a>
<a href="#arquitectura"><img src="https://img.shields.io/badge/▸_ARQUITECTURA-000000?style=for-the-badge" alt="arquitectura"/></a>
<a href="#configuración"><img src="https://img.shields.io/badge/▸_CONFIGURACIÓN-1987F0?style=for-the-badge" alt="config"/></a>
</div>

<br/>

> 🔑 **El webhook es la fuente de la verdad.** La app nunca confía en el cliente para el acceso — solo en la fila `subscriptions` que el webhook mantiene sincronizada.

## Acerca de

Un flujo de **suscripción Stripe** mínimo pero con forma de producción, construido para reflejar una plataforma de mentoría en dos niveles (`Group` + `1:1 Premium`):

- **Stripe Checkout** en modo `subscription`.
- **Webhook** como única fuente de la verdad → sincronizado en **Supabase**.
- **Stripe Customer Portal** para upgrade/downgrade/cancelación (sin UI de facturación personalizada).

## Arquitectura

```
Página de precios ──POST /api/checkout──▶ Stripe Checkout ──▶ pago
                                                                │
        Supabase ◀──upsert── /api/webhook ◀──eventos── Stripe
            │
   GET /api/subscription ──▶ la app controla acceso por status
```

Un usuario puede cerrar el navegador justo después de pagar — así que el redirect de éxito no es confiable. El webhook se dispara de todos modos, y la suscripción se vuelve a consultar desde Stripe en cada evento relevante, haciendo la sincronización idempotente e independiente del orden.

## Configuración

1. `npm install`
2. Completa `.env.local` (claves de test de Stripe, price IDs, claves de Supabase).
3. En Supabase: ejecuta `supabase-schema.sql`.
4. En Stripe (modo test): crea dos productos recurrentes → pon sus price IDs en `.env.local`.
5. Ejecuta la app: `npm run dev`
6. Reenvía webhooks localmente:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   (copia el `whsec_...` impreso en `STRIPE_WEBHOOK_SECRET`)
7. Suscríbete con la tarjeta de prueba `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC.

## Licencia

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Desarrollado por <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
