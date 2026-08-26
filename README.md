<!-- ══════════════════════════ TÍTULO ══════════════════════════ -->
<div align="center">
  <img src="docs/title-banner.svg" width="100%" alt="Stripe Subscription Demo"/>
</div>

<!-- ══════════════════════ IDIOMAS / LANGUAGES ══════════════════════ -->
<div align="center">
<a href="README.md"><img src="https://img.shields.io/badge/Português-1987F0?style=for-the-badge" alt="Português"/></a>
<a href="README.en.md"><img src="https://img.shields.io/badge/English-555555?style=for-the-badge" alt="English"/></a>
<a href="README.es.md"><img src="https://img.shields.io/badge/Español-555555?style=for-the-badge" alt="Español"/></a>
</div>

<h1 align="center">Stripe Subscription Demo</h1>
<p align="center"><em>Fluxo de assinatura Stripe mínimo, mas com formato de produção, pra uma plataforma de mentoria em dois níveis</em></p>
<p align="center"><strong>Checkout → webhook (fonte da verdade) → Supabase → acesso controlado por status</strong></p>

<div align="center">
<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="nextjs"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="ts"/>
<img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="stripe"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="supabase"/>
<img src="https://img.shields.io/badge/License-MIT-2E7D32?style=flat-square" alt="license"/>
</div>

<div align="center">
<a href="#sobre"><img src="https://img.shields.io/badge/▸_SOBRE-1987F0?style=for-the-badge" alt="sobre"/></a>
<a href="#arquitetura"><img src="https://img.shields.io/badge/▸_ARQUITETURA-000000?style=for-the-badge" alt="arquitetura"/></a>
<a href="#configuração"><img src="https://img.shields.io/badge/▸_CONFIGURAÇÃO-1987F0?style=for-the-badge" alt="config"/></a>
</div>

<br/>

> 🔑 **Webhook é a fonte da verdade.** O app nunca confia no cliente pra decidir permissão de acesso — só na linha `subscriptions` sincronizada pelo webhook.

## Sobre

Um fluxo de **assinatura Stripe** mínimo, mas com formato de produção, construído pra espelhar uma plataforma de mentoria em dois níveis (`Group` + `1:1 Premium`):

- **Stripe Checkout** em modo `subscription`.
- **Webhook** como única fonte da verdade → sincronizado no **Supabase**.
- **Stripe Customer Portal** pra upgrade/downgrade/cancelamento (sem UI de billing customizada).

## Arquitetura

```
Página de preços ──POST /api/checkout──▶ Stripe Checkout ──▶ pagamento
                                                               │
        Supabase ◀──upsert── /api/webhook ◀──eventos── Stripe
            │
   GET /api/subscription ──▶ app controla acesso pelo status
```

Um usuário pode fechar o navegador logo após pagar — então o redirect de sucesso não é confiável. O webhook dispara de qualquer forma, e a assinatura é rebuscada da Stripe a cada evento relevante, tornando a sincronização idempotente e independente de ordem.

## Configuração

1. `npm install`
2. Preencha `.env.local` (chaves de teste da Stripe, price IDs, chaves do Supabase).
3. No Supabase: rode `supabase-schema.sql`.
4. Na Stripe (modo teste): crie dois produtos recorrentes → coloque os price IDs no `.env.local`.
5. Rode o app: `npm run dev`
6. Encaminhe webhooks localmente:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   (copie o `whsec_...` impresso pra `STRIPE_WEBHOOK_SECRET`)
7. Assine com o cartão de teste `4242 4242 4242 4242`, qualquer data futura, qualquer CVC.

## Licença

[MIT](LICENSE).

<div align="center">
  <img src="https://file.loading.io/color/feature/thumb/Blues-8.png?" width="100%" height="10px" alt="divider"/>
</div>

<p align="center"><sub>Desenvolvido por <strong><a href="https://github.com/geoggrigori">Grigori</a></strong> · 2026</sub></p>
