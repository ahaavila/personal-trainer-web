import { http, HttpResponse } from 'msw'
import type { LoginErrorResponse, LoginRequestBody, LoginSuccessResponse } from '../auth/types'
import type { PersonalDashboardData, StudentDashboardData } from '../dashboard/types'
import type { AlunoListItem } from '../alunos/types'
import type { ExerciseListItem } from '../exercicios/types'

const MOCK_SESSION_COOKIE = 'mock_session'

const PERSONAL_DASHBOARD: PersonalDashboardData = {
  metrics: { students: 4, activeStudents: 3, exercises: 4, trainingPlans: 6 },
  upcomingTrainings: [
    { time: '08:00', studentName: 'Mariana Costa', context: 'Hipertrofia · Treino presencial', status: 'confirmed' },
    { time: '18:30', studentName: 'Lucas Almeida', context: 'Emagrecimento · Treino presencial', status: 'confirmed' },
  ],
  weeklyEvolution: [
    { label: 'Seg', value: 3 },
    { label: 'Ter', value: 5 },
    { label: 'Qua', value: 4 },
    { label: 'Qui', value: 7 },
    { label: 'Sex', value: 6 },
  ],
}

const STUDENT_DASHBOARD: StudentDashboardData = {
  currentPlan: { title: 'Ficha de treino atual', progress: 68 },
  nextWorkouts: [
    { name: 'Treino A · Peito e tríceps', exerciseCount: 6, scheduledFor: 'Hoje' },
    { name: 'Treino B · Costas e bíceps', exerciseCount: 7, scheduledFor: 'Amanhã' },
  ],
  progress: { completedWorkouts: 8, totalWorkouts: 12 },
  weeklyActivity: [
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 0 },
    { label: 'Qua', value: 1 },
    { label: 'Qui', value: 1 },
    { label: 'Sex', value: 0 },
  ],
}

const ALUNOS: AlunoListItem[] = [
  { name: 'Mariana Costa', email: 'mariana.costa@email.com', objective: 'Hipertrofia', level: 'Intermediário', status: 'ativo', latestWorkout: { name: 'Treino A', completedAt: '2026-09-09T08:00:00.000Z' } },
  { name: 'Lucas Almeida', email: 'lucas.almeida@email.com', objective: 'Emagrecimento', level: 'Iniciante', status: 'ativo', latestWorkout: { name: 'Treino B', completedAt: '2026-09-08T19:00:00.000Z' } },
  { name: 'Beatriz Rocha', email: 'beatriz.rocha@email.com', objective: 'Condicionamento', level: 'Avançado', status: 'inativo', latestWorkout: null },
]

const EXERCISES: ExerciseListItem[] = [
  { muscleGroup: 'Perna', level: 'intermediario', name: 'Agachamento livre', description: 'Exercício composto para membros inferiores.', defaultSets: 4, defaultReps: '8 a 10' },
  { muscleGroup: 'Peito', level: 'intermediario', name: 'Supino reto', description: 'Fortalecimento de peitoral, ombros e tríceps.', defaultSets: 4, defaultReps: '8 a 12' },
  { muscleGroup: 'Costas', level: 'iniciante', name: 'Remada baixa', description: 'Movimento controlado para dorsais e braços.', defaultSets: 3, defaultReps: '10 a 12' },
]

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
        headers: {
          'Set-Cookie': `${MOCK_SESSION_COOKIE}=${email}; Path=/`,
        },
      })
    }

    return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(
      { message: 'E-mail ou senha inválidos.' },
      { status: 401 },
    )
  }),

  http.get('/api/auth/me', ({ cookies }) => {
    const email = cookies[MOCK_SESSION_COOKIE]
    const match = email ? TEST_CREDENTIALS[email] : undefined

    if (!match) {
      return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(
        { message: 'Not authenticated.' },
        { status: 401 },
      )
    }

    return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(match.response, {
      status: 200,
    })
  }),

  http.post('/api/auth/logout', () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': `${MOCK_SESSION_COOKIE}=; Path=/; Max-Age=0`,
      },
    })
  }),

  http.get('/api/dashboard/personal', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(PERSONAL_DASHBOARD)
  }),

  http.get('/api/dashboard/aluno', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'aluno@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(STUDENT_DASHBOARD)
  }),

  http.get('/api/alunos', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(ALUNOS)
  }),

  http.post('/api/alunos', async ({ cookies, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const input = (await request.json()) as {
      name?: string
      email?: string
      password?: string
      objective?: string
      level?: string
    }

    if (!input.name || !input.email || !input.password || !input.objective || !input.level) {
      return HttpResponse.json({ message: 'Invalid aluno data' }, { status: 400 })
    }

    const email = input.email.trim().toLowerCase()

    if (ALUNOS.some((aluno) => aluno.email.toLowerCase() === email)) {
      return HttpResponse.json({ message: 'Email is already in use' }, { status: 409 })
    }

    const aluno: AlunoListItem = {
      name: input.name,
      email,
      objective: input.objective,
      level: input.level,
      status: 'ativo',
      latestWorkout: null,
    }
    ALUNOS.push(aluno)
    return HttpResponse.json(aluno, { status: 201 })
  }),

  http.get('/api/exercicios', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(EXERCISES)
  }),
]
