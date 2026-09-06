import type { LoginErrorResponse, LoginRequestBody, LoginSuccessResponse } from './types'

export async function login(body: LoginRequestBody): Promise<LoginSuccessResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as LoginSuccessResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message)
  }

  return data as LoginSuccessResponse
}
