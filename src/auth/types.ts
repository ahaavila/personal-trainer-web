export type Role = 'personal' | 'aluno'

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LoginSuccessResponse {
  role: Role
  name: string
}

export interface LoginErrorResponse {
  message: string
}
