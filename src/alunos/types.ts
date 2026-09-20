export type AlunoStatus = 'ativo' | 'inativo' | 'não informado'

export interface AlunoListItem {
  id?: number
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

export interface CreateAlunoInput {
  name: string
  email: string
  objective: 'hipertrofia' | 'emagrecimento' | 'condicionamento'
  level: 'iniciante' | 'intermediario' | 'avancado'
}
