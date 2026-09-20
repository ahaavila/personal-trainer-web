import { http, HttpResponse } from 'msw'
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
} from '../auth/types'
import type { PersonalDashboardData, StudentDashboardData } from '../dashboard/types'
import type { AlunoListItem } from '../alunos/types'
import type { ExerciseListItem } from '../exercicios/types'
import type { CreateTrainingPlanInput, CreateTrainingPlanResponse, TrainingPlan } from '../fichas/types'
import type { StudentProgressData } from '../progresso/types'

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
  { id: 1, name: 'Mariana Costa', email: 'mariana.costa@email.com', objective: 'Hipertrofia', level: 'Intermediário', status: 'ativo', latestWorkout: { name: 'Treino A', completedAt: '2026-09-09T08:00:00.000Z' } },
  { id: 2, name: 'Lucas Almeida', email: 'lucas.almeida@email.com', objective: 'Emagrecimento', level: 'Iniciante', status: 'ativo', latestWorkout: { name: 'Treino B', completedAt: '2026-09-08T19:00:00.000Z' } },
  { id: 3, name: 'Beatriz Rocha', email: 'beatriz.rocha@email.com', objective: 'Condicionamento', level: 'Avançado', status: 'inativo', latestWorkout: null },
]

const STUDENT_PROGRESS_MOCKS: Record<number, StudentProgressData> = {
  1: {
    aluno: {
      id: 1,
      name: 'Mariana Costa',
      email: 'mariana.costa@email.com',
      objective: 'Hipertrofia',
      level: 'Intermediário',
      status: 'ativo',
      totalWorkouts: 8,
    },
    workoutLogs: [
      {
        id: 104,
        title: 'Treino A · Peito e Tríceps',
        startedAt: '2026-09-18T08:00:00.000Z',
        completedAt: '2026-09-18T08:52:00.000Z',
        durationMinutes: 52,
        notes: 'Sessão intensa, aumentou carga no supino.',
        exercises: [
          {
            id: 201,
            exerciseName: 'Supino reto',
            muscleGroup: 'Peito',
            setsCompleted: 4,
            repsCompleted: '10, 10, 8, 8',
            maxWeightKg: 80,
            notes: 'Boa amplitude e controlo excêntrico.',
          },
          {
            id: 202,
            exerciseName: 'Remada baixa',
            muscleGroup: 'Costas',
            setsCompleted: 3,
            repsCompleted: '12, 10, 10',
            maxWeightKg: 55,
          },
        ],
      },
      {
        id: 103,
        title: 'Treino A · Peito e Tríceps',
        startedAt: '2026-09-14T08:10:00.000Z',
        completedAt: '2026-09-14T09:00:00.000Z',
        durationMinutes: 50,
        exercises: [
          {
            id: 203,
            exerciseName: 'Supino reto',
            muscleGroup: 'Peito',
            setsCompleted: 4,
            repsCompleted: '10, 10, 10, 8',
            maxWeightKg: 75,
            notes: 'Manteve a carga anterior.',
          },
        ],
      },
      {
        id: 102,
        title: 'Treino A · Peito e Tríceps',
        startedAt: '2026-09-08T08:00:00.000Z',
        completedAt: '2026-09-08T08:48:00.000Z',
        durationMinutes: 48,
        exercises: [
          {
            id: 204,
            exerciseName: 'Supino reto',
            muscleGroup: 'Peito',
            setsCompleted: 4,
            repsCompleted: '12, 10, 10, 10',
            maxWeightKg: 75,
          },
          {
            id: 205,
            exerciseName: 'Remada baixa',
            muscleGroup: 'Costas',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 50,
          },
        ],
      },
      {
        id: 101,
        title: 'Treino A · Peito e Tríceps',
        startedAt: '2026-09-01T08:00:00.000Z',
        completedAt: '2026-09-01T08:45:00.000Z',
        durationMinutes: 45,
        notes: 'Início do ciclo de adaptação.',
        exercises: [
          {
            id: 206,
            exerciseName: 'Supino reto',
            muscleGroup: 'Peito',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 70,
          },
          {
            id: 207,
            exerciseName: 'Remada baixa',
            muscleGroup: 'Costas',
            setsCompleted: 3,
            repsCompleted: '12, 12, 12',
            maxWeightKg: 45,
          },
        ],
      },
    ],
    exerciseProgress: {
      'supino-reto': {
        exerciseId: 2,
        exerciseName: 'Supino reto',
        muscleGroup: 'Peito',
        currentMaxLoad: 80,
        startLoad: 70,
        totalGainKg: 10,
        percentageGain: 14.3,
        totalSessions: 4,
        points: [
          {
            date: '2026-09-01',
            sessionTitle: 'Treino A',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 70,
          },
          {
            date: '2026-09-08',
            sessionTitle: 'Treino A',
            setsCompleted: 4,
            repsCompleted: '12, 10, 10, 10',
            maxWeightKg: 75,
          },
          {
            date: '2026-09-14',
            sessionTitle: 'Treino A',
            setsCompleted: 4,
            repsCompleted: '10, 10, 10, 8',
            maxWeightKg: 75,
          },
          {
            date: '2026-09-18',
            sessionTitle: 'Treino A',
            setsCompleted: 4,
            repsCompleted: '10, 10, 8, 8',
            maxWeightKg: 80,
          },
        ],
      },
      'remada-baixa': {
        exerciseId: 3,
        exerciseName: 'Remada baixa',
        muscleGroup: 'Costas',
        currentMaxLoad: 55,
        startLoad: 45,
        totalGainKg: 10,
        percentageGain: 22.2,
        totalSessions: 3,
        points: [
          {
            date: '2026-09-01',
            sessionTitle: 'Treino A',
            setsCompleted: 3,
            repsCompleted: '12, 12, 12',
            maxWeightKg: 45,
          },
          {
            date: '2026-09-08',
            sessionTitle: 'Treino A',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 50,
          },
          {
            date: '2026-09-18',
            sessionTitle: 'Treino A',
            setsCompleted: 3,
            repsCompleted: '12, 10, 10',
            maxWeightKg: 55,
          },
        ],
      },
    },
  },
  2: {
    aluno: {
      id: 2,
      name: 'Lucas Almeida',
      email: 'lucas.almeida@email.com',
      objective: 'Emagrecimento',
      level: 'Iniciante',
      status: 'ativo',
      totalWorkouts: 3,
    },
    workoutLogs: [
      {
        id: 110,
        title: 'Treino B · Costas e Bíceps',
        startedAt: '2026-09-08T19:00:00.000Z',
        completedAt: '2026-09-08T19:40:00.000Z',
        durationMinutes: 40,
        exercises: [
          {
            id: 210,
            exerciseName: 'Remada baixa',
            muscleGroup: 'Costas',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 35,
          },
        ],
      },
    ],
    exerciseProgress: {
      'remada-baixa': {
        exerciseId: 3,
        exerciseName: 'Remada baixa',
        muscleGroup: 'Costas',
        currentMaxLoad: 35,
        startLoad: 35,
        totalGainKg: 0,
        percentageGain: 0,
        totalSessions: 1,
        points: [
          {
            date: '2026-09-08',
            sessionTitle: 'Treino B',
            setsCompleted: 3,
            repsCompleted: '12, 12, 10',
            maxWeightKg: 35,
          },
        ],
      },
    },
  },
}

const EXERCISES: ExerciseListItem[] = [
  { id: 1, muscleGroup: 'Perna', level: 'intermediario', name: 'Agachamento livre', equipment: 'Barra', description: 'Exercício composto para membros inferiores.', defaultSets: 4, defaultReps: '8 a 10' },
  { id: 2, muscleGroup: 'Peito', level: 'intermediario', name: 'Supino reto', equipment: 'Banco', description: 'Fortalecimento de peitoral, ombros e tríceps.', defaultSets: 4, defaultReps: '8 a 12' },
  { id: 3, muscleGroup: 'Costas', level: 'iniciante', name: 'Remada baixa', equipment: 'Halter', description: 'Movimento controlado para dorsais e braços.', defaultSets: 3, defaultReps: '10 a 12' },
]

const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 1,
    title: 'Ficha de Treino Inicial',
    studentEmail: 'mariana.costa@email.com',
    studentName: 'Mariana Costa',
    notes: 'Treino para adaptação neuromuscular e hipertrofia',
    startDate: '2026-09-01',
    endDate: '2026-11-01',
    status: 'active',
    divisionsCount: 2,
    exercisesCount: 3,
    createdAt: '2026-09-01T10:00:00.000Z',
    divisions: [
      {
        id: 1,
        name: 'Treino A · Peito e Tríceps',
        order: 1,
        notes: 'Focar em amplitude',
        exercises: [
          {
            id: 1,
            exerciseId: 2,
            exerciseName: 'Supino reto',
            muscleGroup: 'Peito',
            order: 1,
            sets: 4,
            reps: '8 a 12',
            restInterval: '60s',
            targetLoad: '20kg',
            notes: 'Cadência 3010',
          },
        ],
      },
      {
        id: 2,
        name: 'Treino B · Pernas e Costas',
        order: 2,
        notes: null,
        exercises: [
          {
            id: 2,
            exerciseId: 1,
            exerciseName: 'Agachamento livre',
            muscleGroup: 'Perna',
            order: 1,
            sets: 4,
            reps: '8 a 10',
            restInterval: '90s',
            targetLoad: '40kg',
            notes: 'Descer até 90 graus',
          },
          {
            id: 3,
            exerciseId: 3,
            exerciseName: 'Remada baixa',
            muscleGroup: 'Costas',
            order: 2,
            sets: 3,
            reps: '10 a 12',
            restInterval: '60s',
            targetLoad: '30kg',
            notes: null,
          },
        ],
      },
    ],
  },
]

interface TestCredentialUser {
  id?: number
  password: string
  response: LoginSuccessResponse
  status?: string
  avatarUrl?: string | null
  objective?: string | null
  level?: string | null
}

const TEST_CREDENTIALS: Record<string, TestCredentialUser> = {
  'personal@fitforge.app': {
    id: 1,
    password: 'personal123',
    response: { role: 'personal', name: 'Personal Trainer' },
  },
  'aluno@fitforge.app': {
    id: 2,
    password: 'aluno123',
    response: { role: 'aluno', name: 'Aluno' },
    status: 'ativo',
    objective: 'Hipertrofia',
    level: 'Iniciante',
  },
  'aluno.inativo@fitforge.app': {
    id: 3,
    password: 'aluno123',
    response: { role: 'aluno', name: 'Aluno Inativo' },
    status: 'inativo',
    objective: 'Condicionamento',
    level: 'Avançado',
  },
}

interface ResetTokenData {
  email: string
  expiresAt: number
}

const RESET_TOKENS = new Map<string, ResetTokenData>([
  ['mock-token-personal', { email: 'personal@fitforge.app', expiresAt: Date.now() + 3600000 }],
])

export const handlers = [
  http.post('/api/auth/forgot-password', async ({ request }) => {
    const { email } = (await request.json()) as ForgotPasswordRequestBody

    if (!email || typeof email !== 'string') {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'O e-mail é obrigatório.' },
        { status: 400 },
      )
    }

    const token = `reset-${Math.random().toString(36).substring(2, 10)}`
    RESET_TOKENS.set(token, {
      email,
      expiresAt: Date.now() + 3600000,
    })

    const simulatedUrl = `/redefinir-senha?token=${token}`

    return HttpResponse.json<ForgotPasswordResponse>({
      message: 'Se o e-mail estiver registado, enviámos instruções para redefinir a sua senha.',
      token,
      simulatedUrl,
    })
  }),

  http.post('/api/auth/reset-password', async ({ request }) => {
    const { token, password } = (await request.json()) as ResetPasswordRequestBody

    if (!token) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'Token de recuperação inválido ou em falta.' },
        { status: 400 },
      )
    }

    const tokenData = RESET_TOKENS.get(token)
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'Token de recuperação inválido ou expirado.' },
        { status: 400 },
      )
    }

    if (!password || password.length < 6) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'A nova senha deve ter pelo menos 6 caracteres.' },
        { status: 400 },
      )
    }

    const user = TEST_CREDENTIALS[tokenData.email]
    if (user) {
      user.password = password
    }

    RESET_TOKENS.delete(token)

    return HttpResponse.json<ResetPasswordResponse>({
      message: 'Senha redefinida com sucesso. Pode agora iniciar sessão com a sua nova senha.',
    })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password, rememberMe } = (await request.json()) as LoginRequestBody
    const match = TEST_CREDENTIALS[email]

    if (match && match.password === password) {
      if (match.response.role === 'aluno' && match.status !== 'ativo') {
        return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(
          { message: 'A sua conta de aluno está inativa. Contacte o seu personal trainer.' },
          { status: 401 },
        )
      }

      const cookieHeader = rememberMe
        ? `${MOCK_SESSION_COOKIE}=${email}; Path=/; Max-Age=2592000`
        : `${MOCK_SESSION_COOKIE}=${email}; Path=/`

      return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(match.response, {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader,
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

    if (match.response.role === 'aluno' && match.status !== 'ativo') {
      return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(
        { message: 'A sua conta de aluno está inativa. Contacte o seu personal trainer.' },
        { status: 401 },
      )
    }

    return HttpResponse.json<LoginSuccessResponse | LoginErrorResponse>(match.response, {
      status: 200,
    })
  }),

  http.get('/api/auth/profile', ({ cookies }) => {
    const email = cookies[MOCK_SESSION_COOKIE]
    const match = email ? TEST_CREDENTIALS[email] : undefined

    if (!match) {
      return HttpResponse.json<UserProfileResponse | LoginErrorResponse>(
        { message: 'Not authenticated.' },
        { status: 401 },
      )
    }

    const profile: UserProfileResponse = {
      id: match.id || 1,
      name: match.response.name,
      email,
      role: match.response.role,
      avatarUrl: match.avatarUrl,
      objective: match.objective,
      level: match.level,
      status: match.status,
    }

    return HttpResponse.json<UserProfileResponse | LoginErrorResponse>(profile, { status: 200 })
  }),

  http.patch('/api/auth/profile', async ({ cookies, request }) => {
    const email = cookies[MOCK_SESSION_COOKIE]
    const match = email ? TEST_CREDENTIALS[email] : undefined

    if (!match) {
      return HttpResponse.json<UserProfileResponse | LoginErrorResponse>(
        { message: 'Not authenticated.' },
        { status: 401 },
      )
    }

    const body = (await request.json()) as UpdateProfileRequestBody

    if (!body.name || !body.name.trim()) {
      return HttpResponse.json<UserProfileResponse | LoginErrorResponse>(
        { message: 'O nome não pode estar vazio.' },
        { status: 400 },
      )
    }

    match.response.name = body.name.trim()
    if (body.avatarUrl !== undefined) match.avatarUrl = body.avatarUrl
    if (body.objective !== undefined) match.objective = body.objective || undefined
    if (body.level !== undefined) match.level = body.level || undefined

    const profile: UserProfileResponse = {
      id: match.id || 1,
      name: match.response.name,
      email,
      role: match.response.role,
      avatarUrl: match.avatarUrl,
      objective: match.objective,
      level: match.level,
      status: match.status,
    }

    return HttpResponse.json<UserProfileResponse | LoginErrorResponse>(profile, { status: 200 })
  }),

  http.post('/api/auth/change-password', async ({ cookies, request }) => {
    const email = cookies[MOCK_SESSION_COOKIE]
    const match = email ? TEST_CREDENTIALS[email] : undefined

    if (!match) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'Not authenticated.' },
        { status: 401 },
      )
    }

    const { currentPassword, newPassword } = (await request.json()) as ChangePasswordRequestBody

    if (!currentPassword || match.password !== currentPassword) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'A senha atual está incorreta.' },
        { status: 400 },
      )
    }

    if (!newPassword || newPassword.length < 6) {
      return HttpResponse.json<LoginErrorResponse>(
        { message: 'A nova senha deve ter pelo menos 6 caracteres.' },
        { status: 400 },
      )
    }

    match.password = newPassword

    return HttpResponse.json<ChangePasswordResponse>({
      message: 'Senha alterada com sucesso.',
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

  http.get('/api/alunos/:id/progresso', ({ cookies, params }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const alunoId = Number(params.id)
    const progress = STUDENT_PROGRESS_MOCKS[alunoId]

    if (progress) {
      return HttpResponse.json(progress)
    }

    // Check if aluno exists in ALUNOS list even without mock sessions
    const aluno = ALUNOS.find((a) => a.id === alunoId)
    if (aluno) {
      const emptyProgress: StudentProgressData = {
        aluno: {
          id: aluno.id || alunoId,
          name: aluno.name,
          email: aluno.email,
          objective: aluno.objective,
          level: aluno.level,
          status: aluno.status,
          totalWorkouts: 0,
        },
        workoutLogs: [],
        exerciseProgress: {},
      }
      return HttpResponse.json(emptyProgress)
    }

    return HttpResponse.json({ message: 'Aluno não encontrado' }, { status: 404 })
  }),

  http.post('/api/alunos', async ({ cookies, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const input = (await request.json()) as {
      name?: string
      email?: string
      objective?: string
      level?: string
    }

    if (!input.name || !input.email || !input.objective || !input.level) {
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

    // Generate activation / password setup token in mock memory
    const token = `invite-${Math.random().toString(36).substring(2, 10)}`
    RESET_TOKENS.set(token, {
      email,
      expiresAt: Date.now() + 3600000,
    })

    // Register test credential entry placeholder (student must set password before logging in)
    TEST_CREDENTIALS[email] = {
      password: '',
      response: { role: 'aluno', name: input.name },
      status: 'ativo',
    }

    return HttpResponse.json(aluno, { status: 201 })
  }),

  http.get('/api/exercicios', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(EXERCISES)
  }),

  http.post('/api/exercicios', async ({ cookies, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const input = (await request.json()) as {
      name?: string
      muscleGroup?: string
      equipment?: string
      description?: string
      defaultSets?: number
      defaultReps?: string
      level?: string
    }

    if (!input.name || !input.muscleGroup || !input.description || !input.defaultReps || !input.level) {
      return HttpResponse.json({ message: 'Dados do exercício inválidos.' }, { status: 400 })
    }

    const defaultSets = Number(input.defaultSets)
    if (!Number.isFinite(defaultSets) || defaultSets < 1 || defaultSets > 20) {
      return HttpResponse.json({ message: 'As séries padrão devem estar entre 1 e 20.' }, { status: 400 })
    }

    const exercise: ExerciseListItem = {
      id: Date.now(),
      name: input.name.trim(),
      muscleGroup: input.muscleGroup.trim(),
      equipment: input.equipment?.trim() || undefined,
      description: input.description.trim(),
      defaultSets,
      defaultReps: input.defaultReps.trim(),
      level: (input.level as ExerciseListItem['level']) || 'iniciante',
    }

    EXERCISES.unshift(exercise)
    return HttpResponse.json(exercise, { status: 201 })
  }),

  http.post('/api/exercicios/:id/upload-url', async ({ cookies, params, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { kind, contentType, byteSize } = (await request.json()) as {
      kind?: 'photo' | 'video'
      contentType?: string
      byteSize?: number
    }

    if (!kind || !contentType || !byteSize) {
      return HttpResponse.json({ message: 'Dados de mídia inválidos.' }, { status: 400 })
    }

    const exerciseId = Number(params.id)
    const objectKey = `exercises/1/${exerciseId}/mock-${Date.now()}-${kind}`
    const uploadUrl = `/mock-upload/${objectKey}`

    return HttpResponse.json({
      uploadUrl,
      objectKey,
      expiresIn: 300,
      kind,
      contentType,
      byteSize,
    })
  }),

  http.put('/mock-upload/:path*', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post('/api/exercicios/:id/confirm-upload', async ({ cookies, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { objectKey, kind, contentType, byteSize } = (await request.json()) as {
      objectKey?: string
      kind?: 'photo' | 'video'
      contentType?: string
      byteSize?: number
    }

    if (!objectKey || !kind) {
      return HttpResponse.json({ message: 'Dados de confirmação inválidos.' }, { status: 400 })
    }

    return HttpResponse.json({ objectKey, kind, contentType, byteSize }, { status: 201 })
  }),

  http.put('/api/exercicios/:id', async ({ cookies, params, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const index = EXERCISES.findIndex((e) => e.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Exercício não encontrado.' }, { status: 404 })
    }

    const input = (await request.json()) as Partial<ExerciseListItem>
    const current = EXERCISES[index]

    const updated: ExerciseListItem = {
      ...current,
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.muscleGroup !== undefined ? { muscleGroup: input.muscleGroup.trim() } : {}),
      ...(input.equipment !== undefined ? { equipment: input.equipment.trim() || undefined } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.defaultSets !== undefined ? { defaultSets: Number(input.defaultSets) } : {}),
      ...(input.defaultReps !== undefined ? { defaultReps: input.defaultReps.trim() } : {}),
      ...(input.level !== undefined ? { level: input.level } : {}),
    }

    EXERCISES[index] = updated
    return HttpResponse.json(updated, { status: 200 })
  }),

  http.delete('/api/exercicios/:id', ({ cookies, params }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const index = EXERCISES.findIndex((e) => e.id === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Exercício não encontrado.' }, { status: 404 })
    }

    EXERCISES.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/exercicios/:id/media', ({ cookies, params }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const exercise = EXERCISES.find((e) => e.id === id)
    return HttpResponse.json(exercise?.media || [])
  }),

  http.delete('/api/exercicios/:id/media/:mediaId', ({ cookies, params }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const mediaId = Number(params.mediaId)
    const exercise = EXERCISES.find((e) => e.id === id)

    if (exercise && exercise.media) {
      exercise.media = exercise.media.filter((m) => m.id !== mediaId)
    }

    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/fichas-de-treino', ({ cookies }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(TRAINING_PLANS)
  }),

  http.post('/api/fichas-de-treino', async ({ cookies, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const input = (await request.json()) as CreateTrainingPlanInput

    if (!input || typeof input !== 'object') {
      return HttpResponse.json({ message: 'Dados da ficha inválidos.' }, { status: 400 })
    }

    const alunoId = input.alunoId !== undefined ? Number(input.alunoId) : undefined
    const aluno = ALUNOS.find(
      (a) => (alunoId !== undefined && a.id === alunoId) || (input as { studentEmail?: string }).studentEmail === a.email,
    )

    if (!aluno) {
      return HttpResponse.json({ message: 'Selecione um aluno válido para vincular à ficha.' }, { status: 400 })
    }

    const title = input.title?.trim()
    if (!title || title.length < 2) {
      return HttpResponse.json({ message: 'O título da ficha deve ter pelo menos 2 caracteres.' }, { status: 400 })
    }

    if (!Array.isArray(input.divisions) || input.divisions.length === 0) {
      return HttpResponse.json({ message: 'A ficha precisa conter pelo menos uma divisão de treino.' }, { status: 400 })
    }

    let totalExercises = 0
    for (const division of input.divisions) {
      if (!division.name?.trim()) {
        return HttpResponse.json({ message: 'Todas as divisões de treino precisam ter um nome.' }, { status: 400 })
      }
      if (!Array.isArray(division.exercises) || division.exercises.length === 0) {
        return HttpResponse.json({ message: `A divisão "${division.name}" precisa conter pelo menos um exercício.` }, { status: 400 })
      }

      for (const ex of division.exercises) {
        const exId = ex.exercicioId ?? (ex as { exerciseId?: number }).exerciseId
        const found = EXERCISES.find((item) => item.id === exId)
        if (!found) {
          return HttpResponse.json({ message: `Exercício com ID ${exId} não encontrado.` }, { status: 400 })
        }
        if (!ex.sets || Number(ex.sets) < 1) {
          return HttpResponse.json({ message: 'O número de séries de cada exercício deve ser maior que 0.' }, { status: 400 })
        }
        if (!ex.reps?.trim()) {
          return HttpResponse.json({ message: 'As repetições de cada exercício são obrigatórias.' }, { status: 400 })
        }
        totalExercises += 1
      }
    }

    const newId = Date.now()
    const nowIso = new Date().toISOString()

    const newPlan: TrainingPlan = {
      id: newId,
      title,
      alunoId: aluno.id,
      studentEmail: aluno.email,
      studentId: aluno.id,
      studentName: aluno.name,
      notes: input.notes?.trim() || null,
      startDate: input.startDate?.trim() || null,
      endDate: input.endDate?.trim() || null,
      status: 'active',
      divisionsCount: input.divisions.length,
      exercisesCount: totalExercises,
      createdAt: nowIso,
      updatedAt: nowIso,
      divisions: input.divisions.map((div, divIndex) => ({
        id: divIndex + 1,
        name: div.name.trim(),
        order: div.order ?? divIndex + 1,
        notes: div.notes?.trim() || null,
        exercises: div.exercises.map((ex, exIndex) => {
          const exId = ex.exercicioId ?? (ex as { exerciseId?: number }).exerciseId
          const baseEx = EXERCISES.find((item) => item.id === exId)!
          return {
            id: exIndex + 1,
            exercicioId: exId,
            exerciseId: exId,
            exerciseName: baseEx.name,
            muscleGroup: baseEx.muscleGroup,
            order: ex.order ?? exIndex + 1,
            sets: Number(ex.sets),
            reps: ex.reps.trim(),
            restInterval: ex.restInterval?.trim() || null,
            targetLoad: ex.targetLoad?.trim() || null,
            notes: ex.notes?.trim() || null,
          }
        }),
      })),
    }

    TRAINING_PLANS.unshift(newPlan)
    PERSONAL_DASHBOARD.metrics.trainingPlans = TRAINING_PLANS.length

    const response: CreateTrainingPlanResponse = {
      id: newPlan.id,
      title: newPlan.title,
      alunoId: aluno.id,
      studentId: aluno.id,
      studentEmail: aluno.email,
      studentName: aluno.name,
      status: 'active',
      divisionsCount: newPlan.divisionsCount!,
      exercisesCount: newPlan.exercisesCount!,
      createdAt: nowIso,
    }

    return HttpResponse.json(response, { status: 201 })
  }),

  http.put('/api/fichas-de-treino/:id', async ({ cookies, params, request }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const index = TRAINING_PLANS.findIndex((p) => Number(p.id) === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Ficha de treino não encontrada.' }, { status: 404 })
    }

    const input = (await request.json()) as CreateTrainingPlanInput
    const current = TRAINING_PLANS[index]

    const alunoId = input.alunoId !== undefined ? Number(input.alunoId) : current.alunoId
    const aluno = ALUNOS.find((a) => a.id === alunoId) || {
      id: current.alunoId,
      name: current.studentName || 'Aluno',
      email: current.studentEmail || '',
      objective: current.studentObjective || 'hipertrofia',
    }

    const title = input.title?.trim() || current.title

    let totalExercises = 0
    const divisions = (input.divisions || []).map((div, divIndex) => ({
      id: divIndex + 1,
      name: div.name.trim(),
      order: div.order ?? divIndex + 1,
      notes: div.notes?.trim() || null,
      exercises: (div.exercises || []).map((ex, exIndex) => {
        const exId = ex.exercicioId ?? (ex as { exerciseId?: number }).exerciseId
        const baseEx = EXERCISES.find((item) => item.id === exId)
        totalExercises += 1
        return {
          id: exIndex + 1,
          exercicioId: exId,
          exerciseId: exId,
          exerciseName: baseEx?.name || 'Exercício',
          muscleGroup: baseEx?.muscleGroup || 'Geral',
          equipment: baseEx?.equipment || null,
          order: ex.order ?? exIndex + 1,
          sets: Number(ex.sets),
          reps: ex.reps.trim(),
          restInterval: ex.restInterval?.trim() || null,
          targetLoad: ex.targetLoad?.trim() || null,
          notes: ex.notes?.trim() || null,
        }
      }),
    }))

    const updated: TrainingPlan = {
      ...current,
      title,
      alunoId: aluno.id,
      studentId: aluno.id,
      studentEmail: aluno.email,
      studentName: aluno.name,
      notes: input.notes !== undefined ? (input.notes?.trim() || null) : current.notes,
      startDate: input.startDate !== undefined ? (input.startDate?.trim() || null) : current.startDate,
      endDate: input.endDate !== undefined ? (input.endDate?.trim() || null) : current.endDate,
      divisionsCount: divisions.length,
      exercisesCount: totalExercises,
      divisions,
      updatedAt: new Date().toISOString(),
    }

    TRAINING_PLANS[index] = updated
    return HttpResponse.json(updated, { status: 200 })
  }),

  http.delete('/api/fichas-de-treino/:id', ({ cookies, params }) => {
    if (cookies[MOCK_SESSION_COOKIE] !== 'personal@fitforge.app') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const id = Number(params.id)
    const index = TRAINING_PLANS.findIndex((p) => Number(p.id) === id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Ficha de treino não encontrada.' }, { status: 404 })
    }

    TRAINING_PLANS.splice(index, 1)
    PERSONAL_DASHBOARD.metrics.trainingPlans = TRAINING_PLANS.length
    return new HttpResponse(null, { status: 204 })
  }),
]
