import type {
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  LoginErrorResponse,
  LoginRequestBody,
  LoginSuccessResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
} from './types'

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

export async function requestPasswordReset(body: ForgotPasswordRequestBody): Promise<ForgotPasswordResponse> {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as ForgotPasswordResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message || 'Erro ao solicitar recuperação de senha.')
  }

  return data as ForgotPasswordResponse
}

export async function resetPassword(body: ResetPasswordRequestBody): Promise<ResetPasswordResponse> {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as ResetPasswordResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message || 'Erro ao redefinir senha.')
  }

  return data as ResetPasswordResponse
}
