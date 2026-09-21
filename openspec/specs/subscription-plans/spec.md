## Purpose

Provides subscription tier definitions (Plano Básico vs Plano PRO), active student capacity limits, Stripe Checkout session creation for upgrading to PRO, Stripe Customer Portal for billing management, webhook handling for recurring payments, and subscription status visualization.

## Requirements

### Requirement: Personal trainer subscription plan status
The system SHALL provide an endpoint and UI displaying the personal trainer's current subscription plan (`basic` or `pro`), subscription status (`active`, `past_due`, `canceled`), active students count, and maximum allowed active students (5 for Basic, unlimited for PRO).

#### Scenario: Personal views subscription details
- **WHEN** an authenticated personal views the subscription settings
- **THEN** the system displays their current plan name, quota usage (e.g. "3 de 5 alunos ativos utilizados"), and the available plan actions (Upgrade to PRO or Manage Subscription)

### Requirement: Stripe Checkout session for upgrading to Plano PRO
The system SHALL allow personal trainers on the Basic plan to initiate an upgrade to Plano PRO by generating a secure Stripe Checkout Session and redirecting the trainer to complete payment.

#### Scenario: Personal initiates upgrade to PRO
- **WHEN** a personal trainer clicks the upgrade button for Plano PRO
- **THEN** the system creates a Stripe Checkout session configured for recurring monthly billing and returns the checkout URL to redirect the user

### Requirement: Stripe Customer Portal for managing active subscription
The system SHALL allow personal trainers with an active PRO subscription to access the Stripe Customer Portal to update payment methods, view invoices, or cancel their subscription.

#### Scenario: Personal opens billing portal
- **WHEN** a personal trainer on Plano PRO clicks to manage their subscription
- **THEN** the system creates a Stripe Customer Portal session and redirects the user to manage their billing details

### Requirement: Webhook reconciliation for Stripe subscription events
The system SHALL process incoming Stripe webhook events (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`) using webhook signature verification, updating the personal trainer's plan and status in the database accordingly.

#### Scenario: Successful subscription checkout webhook received
- **WHEN** Stripe sends a `checkout.session.completed` webhook event for a subscription
- **THEN** the system marks the personal trainer's plan as `pro` and status as `active`

#### Scenario: Subscription cancellation webhook received
- **WHEN** Stripe sends a `customer.subscription.deleted` webhook event
- **THEN** the system updates the personal trainer's plan to `basic`
