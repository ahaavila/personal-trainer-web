export interface WeeklyPoint {
  label: string
  value: number
}

export interface UpcomingTraining {
  time: string
  clientName: string
  context: string
  status: 'confirmed' | 'pending'
}

export interface PersonalDashboardData {
  metrics: {
    clients: number
    activeClients: number
    exercises: number
    trainingPlans: number
  }
  upcomingTrainings: UpcomingTraining[]
  weeklyEvolution: WeeklyPoint[]
}

export interface StudentDashboardData {
  currentPlan: {
    title: string
    progress: number
  } | null
  nextWorkouts: Array<{
    name: string
    exerciseCount: number
    scheduledFor?: string
  }>
  progress: {
    completedWorkouts: number
    totalWorkouts: number
  }
  weeklyActivity: WeeklyPoint[]
}

export type DashboardData = PersonalDashboardData | StudentDashboardData
