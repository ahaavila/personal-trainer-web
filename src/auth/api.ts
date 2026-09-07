import type { LoginErrorResponse, LoginRequestBody, LoginSuccessResponse } from './types'

export async function login(body: LoginRequestBody): Promise<LoginSuccessResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as LoginSuccessResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message)
  }

  return data as LoginSuccessResponse
}

export async function getSession(): Promise<LoginSuccessResponse | null> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as LoginSuccessResponse
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}
