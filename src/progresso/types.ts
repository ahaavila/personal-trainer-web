export interface WorkoutExerciseLog {
  id: number
  exerciseName: string
  muscleGroup: string
  setsCompleted: number
  repsCompleted: string // e.g. "10, 10, 8, 8"
  maxWeightKg: number
  notes?: string
}

export interface WorkoutSessionLog {
  id: number
  title: string
  startedAt: string
  completedAt: string
  durationMinutes: number
  notes?: string
  exercises: WorkoutExerciseLog[]
}

export interface ExerciseProgressPoint {
  date: string
  sessionTitle: string
  setsCompleted: number
  repsCompleted: string
  maxWeightKg: number
  notes?: string
}

export interface ExerciseProgressSummary {
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  currentMaxLoad: number
  startLoad: number
  totalGainKg: number
  percentageGain: number
  totalSessions: number
  points: ExerciseProgressPoint[]
}

export interface StudentProgressData {
  aluno: {
    id: number
    name: string
    email: string
    objective: string
    level: string
    status: string
    totalWorkouts: number
  }
  workoutLogs: WorkoutSessionLog[]
  exerciseProgress: Record<string, ExerciseProgressSummary> // keyed by exerciseId or name
}
