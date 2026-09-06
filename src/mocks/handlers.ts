import { http, HttpResponse } from 'msw'
import type { LoginErrorResponse, LoginRequestBody, LoginSuccessResponse } from '../auth/types'

const TEST_CREDENTIALS: Record<string, { password: string; response: LoginSuccessResponse }> = {
  'personal@fitforge.app': {
    password: 'personal123',
    response: { role: 'personal', name: 'Personal Trainer' },
  },
  'aluno@fitforge.app': {
    password: 'aluno123',
    response: { role: 'aluno', name: 'Aluno' },
  },
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequestBody
    const match = TEST_CREDENTIALS[email]

    if (match && match.password === password) {
      return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(match.response, {
        status: 200,
      })
    }

    return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(
      { message: 'E-mail ou senha inválidos.' },
      { status: 401 },
    )
  }),
]
