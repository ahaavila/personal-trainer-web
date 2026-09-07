import type { Role } from '../auth/types'
import type { DashboardData, PersonalDashboardData, StudentDashboardData, WeeklyPoint } from './types'

async function getDashboard<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar o dashboard.')
  }

  return (await response.json()) as T
}

export function getPersonalDashboard(): Promise<PersonalDashboardData> {
  return getDashboard<Record<string, unknown>>('/api/dashboard/personal').then((payload) => {
    const metrics = payload.metrics as Record<string, number> | undefined
    const upcomingTrainings = (payload.upcomingTrainings as Array<Record<string, unknown>> | undefined) ?? []
    return {
      metrics: {
        clients: metrics?.clients ?? metrics?.clientsCount ?? 0,
        activeClients: metrics?.activeClients ?? metrics?.clientsCount ?? 0,
        exercises: metrics?.exercises ?? metrics?.exercisesCount ?? 0,
        trainingPlans: metrics?.trainingPlans ?? metrics?.trainingPlansCount ?? 0,
      },
      upcomingTrainings: upcomingTrainings.map((training) => ({
        time: typeof training.time === 'string' ? training.time : '--:--',
        clientName: typeof training.clientName === 'string' ? training.clientName : typeof training.alunoName === 'string' ? training.alunoName : 'Cliente',
        context: typeof training.context === 'string' ? training.context : typeof training.planTitle === 'string' ? `${training.name ?? 'Treino'} · ${training.planTitle}` : String(training.name ?? 'Treino'),
        status: training.status === 'pending' ? 'pending' : 'confirmed',
      })),
      weeklyEvolution: normalizeWeeklyPoints(payload.weeklyEvolution),
    }
  })
}

export function getStudentDashboard(): Promise<StudentDashboardData> {
  return getDashboard<Record<string, unknown>>('/api/dashboard/aluno').then((payload) => {
    const currentPlan = payload.currentPlan as Record<string, unknown> | null | undefined
    const progress = payload.progress as Record<string, number> | undefined
    const nextWorkouts = (payload.nextWorkouts as Array<Record<string, unknown>> | undefined) ?? []
    return {
      currentPlan: currentPlan ? { title: String(currentPlan.title ?? 'Ficha de treino atual'), progress: progressPercent(progress) } : null,
      nextWorkouts: nextWorkouts.map((workout) => ({ name: String(workout.name ?? 'Treino'), exerciseCount: Number(workout.exerciseCount ?? 0), scheduledFor: typeof workout.scheduledFor === 'string' ? workout.scheduledFor : undefined })),
      progress: { completedWorkouts: progress?.completedWorkouts ?? 0, totalWorkouts: progress?.totalWorkouts ?? 0 },
      weeklyActivity: normalizeWeeklyPoints(payload.weeklyActivity),
    }
  })
}

function progressPercent(progress?: Record<string, number>) {
  if (!progress?.totalWorkouts) return 0
  return Math.round((progress.completedWorkouts / progress.totalWorkouts) * 100)
}

function normalizeWeeklyPoints(value: unknown): WeeklyPoint[] {
  if (!Array.isArray(value)) return []
  return value.map((point, index) => {
    const item = point as Record<string, unknown>
    return { label: typeof item.label === 'string' ? item.label : typeof item.day === 'string' ? item.day.replace('day-', 'D') : `D${index + 1}`, value: Number(item.value ?? 0) }
  })
}

export function getDashboardForRole(role: Role): Promise<DashboardData> {
  return role === 'personal' ? getPersonalDashboard() : getStudentDashboard()
}
