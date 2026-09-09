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

export interface CreateAlunoInput {
  name: string
  email: string
  password: string
  objective: 'hipertrofia' | 'emagrecimento' | 'condicionamento'
  level: 'iniciante' | 'intermediario' | 'avancado'
}
