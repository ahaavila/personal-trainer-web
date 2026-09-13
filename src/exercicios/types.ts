export type ExerciseLevel = 'iniciante' | 'intermediario' | 'avancado'

export interface ExerciseMediaItem {
  id?: number
  kind: 'photo' | 'video'
  contentType: string
  byteSize: number
  url?: string | null
}

export interface ExerciseListItem {
  id?: number
  name: string
  muscleGroup: string
  equipment?: string
  description: string
  defaultSets: number
  defaultReps: string
  level: ExerciseLevel
  media?: ExerciseMediaItem[]
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
