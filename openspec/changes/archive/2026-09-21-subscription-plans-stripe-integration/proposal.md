## Why

To establish sustainable monetization for the platform, FitManager Pro needs two tiers of service: a free **Plano Básico** and a paid **Plano PRO**.
In the Basic plan, personal trainers can manage up to 5 active students. In the PRO plan, personal trainers have unlimited active students, backed by real monthly recurring subscription billing integrated with Stripe.

## What Changes

- Introduce subscription tiers (`basic` and `pro`) for personal trainers.
- Enforce active student capacity limits:
  - Plano Básico: maximum 5 active students (`status = 'ativo'`). Inactive/archived students do not count toward this limit.
  - Plano PRO: unlimited active students.
- Block the creation of a 6th active student on the Basic plan both in backend (`POST /api/alunos` returns `403 Forbidden` with a limit-reached code) and frontend (intercepting form submission and providing an upgrade prompt).
- Allow personal trainers to toggle student status (`ativo` / `inativo`) so they can archive/inactivate students on the Basic tier to free up capacity.
- Add an active student quota indicator on the personal trainer's dashboard and student management page (e.g., "3/5 alunos ativos").
- Integrate Stripe recurring subscription checkout:
  - Endpoint to create a Stripe Checkout Session for upgrading to Plano PRO.
  - Endpoint to access the Stripe Customer Portal for billing management and subscription cancellation.
  - Stripe Webhook handling (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`) to automatically update user tier status.
- Add a subscription management view (`/planos` or dedicated section in `/meu-perfil`) displaying current tier, billing status, quota, and upgrade/manage actions.

## Capabilities

### New Capabilities
- `subscription-plans`: Covers subscription tier definitions (Basic vs PRO), Stripe checkout sessions, customer portal billing management, webhook reconciliation, and plan status presentation.

### Modified Capabilities
- `student-creation`: Modifies the student creation workflow to enforce active student quota limits according to the trainer's subscription plan, blocking creation when 5 active students are reached on the Basic plan and prompting for upgrade to PRO.
- `student-listing`: Allows personal trainers to toggle a student's active/inactive status to free up quota on the Basic plan, and shows the active student counter.

## Impact

- **Backend (`personal-trainer-backend`)**:
  - Prisma schema update: Add `plan` (`basic` | `pro`), `stripeCustomerId`, `stripeSubscriptionId`, `subscriptionStatus` to `User` or dedicated `Subscription` model.
  - New `SubscriptionModule` with Stripe SDK integration (`@stripe/stripe-node`), checkout sessions, portal sessions, and webhook controller.
  - `AlunosService`: Active student count check (`count({ where: { personalId, status: 'ativo' } })`) before creating or activating students.
- **Frontend (`personal-trainer-web`)**:
  - Plans and billing UI (`/planos` or subscription tab/section in `/meu-perfil`).
  - Upgrade modal/banner when reaching 5 active students.
  - Student status management (activate/inactivate) on students list.
  - Active students quota display (e.g., "Alunos ativos: 4/5").
