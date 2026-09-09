export type ExerciseLevel = 'iniciante' | 'intermediario' | 'avancado'

export interface ExerciseListItem {
  name: string
  muscleGroup: string
  description: string
  defaultSets: number
  defaultReps: string
  level: ExerciseLevel
}
