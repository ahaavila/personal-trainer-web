export type SubscriptionPlan = 'basic' | 'pro'

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'trialing'
  | 'unpaid'
  | 'incomplete'

export interface SubscriptionStatusResponse {
  plan: SubscriptionPlan
  status: SubscriptionStatus | null
  activeStudents: number
  maxActiveStudents: number | null // 5 for basic, null for pro
  isUnlimited: boolean
  stripeCustomerId: string | null
  currentPeriodEnd: string | null
}

export interface CheckoutSessionResponse {
  url: string
}

export interface CustomerPortalResponse {
  url: string
}
