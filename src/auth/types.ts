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
