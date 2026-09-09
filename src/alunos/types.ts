export type AlunoStatus = 'ativo' | 'inativo' | 'não informado'

export interface AlunoListItem {
  name: string
  email: string
  objective: string
  level: string
  status: AlunoStatus
  latestWorkout: {
    name: string
    completedAt: string
  } | null
}
