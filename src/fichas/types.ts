export interface CreateTreinoExercicioInput {
  exercicioId: number
  order: number
  sets: number
  reps: string
  restInterval?: string | null
  targetLoad?: string | null
  notes?: string | null
}

export interface CreateTreinoDivisionInput {
  name: string
  order: number
  notes?: string | null
  exercises: CreateTreinoExercicioInput[]
}

export interface CreateTrainingPlanInput {
  alunoId: number
  title: string
  notes?: string | null
  startDate?: string | null
  endDate?: string | null
  divisions: CreateTreinoDivisionInput[]
}

export interface TrainingPlanDivisionExercise {
  id?: number
  exercicioId?: number
  exerciseId?: number
  exerciseName?: string
  muscleGroup?: string
  order: number
  sets: number
  reps: string
  restInterval?: string | null
  targetLoad?: string | null
  notes?: string | null
}

export interface TrainingPlanDivision {
  id?: number
  name: string
  order: number
  notes?: string | null
  exercises: TrainingPlanDivisionExercise[]
}

export interface TrainingPlan {
  id: number | string
  title: string
  alunoId?: number
  studentEmail?: string
  studentId?: number | string
  studentName?: string
  notes?: string | null
  startDate?: string | null
  endDate?: string | null
  status?: 'active' | 'archived' | 'draft'
  divisions: TrainingPlanDivision[]
  divisionsCount?: number
  exercisesCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateTrainingPlanResponse {
  id: number | string
  title: string
  alunoId?: number
  studentId?: number | string
  studentEmail?: string
  studentName?: string
  status?: string
  divisionsCount?: number
  exercisesCount?: number
  createdAt: string
}

export interface FormExerciseItem {
  localId: string
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  equipment?: string
  sets: number
  reps: string
  restInterval: string
  targetLoad: string
  notes: string
}

export interface FormDivisionItem {
  localId: string
  name: string
  notes: string
  exercises: FormExerciseItem[]
}

export interface PlanFormValues {
  alunoId: number | ''
  title: string
  notes: string
  startDate: string
  endDate: string
  divisions: FormDivisionItem[]
}
