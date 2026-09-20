export type Role = 'personal' | 'aluno'

export interface LoginRequestBody {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginSuccessResponse {
  role: Role
  name: string
}

export interface LoginErrorResponse {
  message: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  token?: string
  simulatedUrl?: string
}

export interface ResetPasswordRequestBody {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface UserProfileResponse {
  id: number
  name: string
  email: string
  role: Role
  avatarUrl?: string | null
  objective?: string | null
  level?: string | null
  status?: string | null
}

export interface UpdateProfileRequestBody {
  name: string
  avatarUrl?: string | null
  objective?: string | null
  level?: string | null
}

export interface ChangePasswordRequestBody {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  message: string
}
