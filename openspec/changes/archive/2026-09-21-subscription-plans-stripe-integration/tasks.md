## 1. Backend: Data Model and Quota Enforcement

- [x] 1.1 Update Prisma schema with `plan` (`basic` | `pro`), `stripeCustomerId`, `stripeSubscriptionId`, and `subscriptionStatus` fields, generate migration and run Prisma deploy
- [x] 1.2 Implement student quota validation in `AlunosService` (max 5 active students for Basic plan) and add student status toggle endpoint (`PATCH /api/alunos/:id/status`)
- [x] 1.3 Implement `SubscriptionModule` with Stripe SDK, checkout session generation (`POST /api/subscription/checkout`), customer portal session (`POST /api/subscription/portal`), status check (`GET /api/subscription/status`), and webhook receiver (`POST /api/subscription/webhook`)

## 2. Frontend: Subscription UI and Paywall Flow

- [x] 2.1 Add subscription types, API service methods, and MSW handlers in `personal-trainer-web`
- [x] 2.2 Create `/planos` page comparing Plano Básico (Grátis, até 5 alunos) and Plano PRO (Ilimitado, com botão de assinatura via Stripe)
- [x] 2.3 Add active students quota progress indicator on `/alunos` and `/dashboard` (e.g. "3/5 alunos ativos")
- [x] 2.4 Add student status toggle button (Ativar/Desativar) in the alunos table to allow trainers to archive inactive students
- [x] 2.5 Add paywall modal and form interception on `/criar-utilizador` when trainer attempts to add a 6th active student on Plano Básico

## 3. Verification and Integration

- [x] 3.1 Verify student creation is blocked at 5 active students and allowed again once a student is deactivated
- [x] 3.2 Verify Stripe Checkout and Customer Portal session creation and webhook plan upgrade/downgrade
- [x] 3.3 Run tests, linter, and build checks across web and backend
