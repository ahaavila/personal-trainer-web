export type ExerciseLevel = 'iniciante' | 'intermediario' | 'avancado'

export interface ExerciseListItem {
  id?: number
  name: string
  muscleGroup: string
  equipment?: string
  description: string
  defaultSets: number
  defaultReps: string
  level: ExerciseLevel
}

export interface CreateExerciseInput {
  name: string
  muscleGroup: string
  equipment?: string
  description: string
  defaultSets: number
  defaultReps: string
  level: ExerciseLevel
}
