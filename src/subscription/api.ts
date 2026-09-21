import type {
  CheckoutSessionResponse,
  CustomerPortalResponse,
  SubscriptionStatusResponse,
} from './types'

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  const response = await fetch('/api/subscription/status', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Não foi possível obter os dados da assinatura.')
  }

  return (await response.json()) as SubscriptionStatusResponse
}

export async function createCheckoutSession(): Promise<CheckoutSessionResponse> {
  const response = await fetch('/api/subscription/checkout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Falha ao iniciar checkout do Stripe.')
  }

  return (await response.json()) as CheckoutSessionResponse
}

export async function createPortalSession(): Promise<CustomerPortalResponse> {
  const response = await fetch('/api/subscription/portal', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Falha ao aceder ao portal de assinatura do Stripe.')
  }

  return (await response.json()) as CustomerPortalResponse
}
