import type {
  ChangePasswordRequestBody,
  ChangePasswordResponse,
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  LoginErrorResponse,
  LoginRequestBody,
  LoginSuccessResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
  UpdateProfileRequestBody,
  UserProfileResponse,
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

export async function getProfileDetails(): Promise<UserProfileResponse> {
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    credentials: 'include',
  })

  const data = (await response.json()) as UserProfileResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message || 'Não foi possível carregar os dados do perfil.')
  }

  return data as UserProfileResponse
}

export async function updateProfile(body: UpdateProfileRequestBody): Promise<UserProfileResponse> {
  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as UserProfileResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message || 'Não foi possível atualizar o perfil.')
  }

  return data as UserProfileResponse
}

export async function changePassword(body: ChangePasswordRequestBody): Promise<ChangePasswordResponse> {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as ChangePasswordResponse | LoginErrorResponse

  if (!response.ok) {
    throw new Error((data as LoginErrorResponse).message || 'Não foi possível alterar a senha.')
  }

  return data as ChangePasswordResponse
}
