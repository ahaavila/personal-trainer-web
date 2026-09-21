## Context

Currently, the system allows any personal trainer to add an unlimited number of students with no plan distinction or payment model. To commercialize FitManager Pro, we introduce a dual-tier model:
- **Plano Básico**: Free, limited to 5 active students (`status = 'ativo'`). Inactive/archived students do not consume active quota.
- **Plano PRO**: Paid recurring subscription with unlimited students, managed via Stripe Checkout and Stripe Customer Portal.

## Goals / Non-Goals

**Goals:**
- Enforce the 5 active student limit at the database/service layer in `AlunosService.create` and when reactivating a student.
- Allow personal trainers to toggle student status (`ativo` / `inativo`) directly from the student roster to archive students without deleting historical records.
- Introduce Stripe Checkout integration:
  - `POST /api/subscription/checkout`: Creates a session for Plano PRO recurring monthly billing.
  - `POST /api/subscription/portal`: Creates a session for the Stripe Customer Portal.
  - `GET /api/subscription/status`: Returns current plan (`basic` or `pro`), active students count, limit (5 or `null`), and subscription details.
  - `POST /api/subscription/webhook`: Verifies Stripe signatures and reconciles subscription lifecycle events.
- Build frontend billing and plan management interfaces:
  - Plan selection & comparison view (`/planos`).
  - Active student counter bar on `/alunos` and `/dashboard`.
  - Paywall modal/banner when attempting to create a 6th active student.

**Non-Goals:**
- Annual billing cycles in this initial version (monthly recurring only).
- Multi-currency conversion (standardized in EUR/BRL configurable via environment).
- Student-side subscriptions (students remain free accounts invited by trainers).

## Decisions

1. **Quota Definition (Active vs Total)**:
   - Only students with `status = 'ativo'` count towards the 5-student limit.
   - *Rationale*: Allows personal trainers to archive past or paused clients without losing their training plans or workout history, opening up capacity for new active clients.
   - Re-activating an inactive student must also validate that the active quota has not been exceeded.

2. **Stripe Architecture**:
   - Use Stripe Checkout hosted pages (`stripe.checkout.sessions.create`) for PCI compliance and zero client-side credit card data handling.
   - Use Stripe Customer Portal (`stripe.billingPortal.sessions.create`) for card changes, invoices, and self-service cancellations.
   - Handle events via a raw body endpoint with `stripe.webhooks.constructEvent`.
   - Store `stripeCustomerId`, `stripeSubscriptionId`, and `plan` on the `User` model in Prisma.

3. **Graceful Fallback & Mocking in Dev**:
   - When Stripe environment variables (`STRIPE_SECRET_KEY`) are not configured or in development mode, provide a simulation mode so frontend flows and quota limits can be verified without requiring live Stripe keys.

## Risks / Trade-offs

- [Risk] Webhook delivery delay or temporary network failure after checkout completion.  
  → Mitigation: In addition to webhooks, the frontend success redirect URL (`/planos?session_id={CHECKOUT_SESSION_ID}`) can call a sync endpoint to immediately verify session status with Stripe.
- [Risk] Personal with 5 active students attempts concurrent student creations.  
  → Mitigation: Use a database transaction and `count({ where: { personalId, status: 'ativo' } })` within `prisma.$transaction`.
