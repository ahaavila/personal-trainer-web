import type { AlunoListItem } from './types'

export async function getAlunos(): Promise<AlunoListItem[]> {
  const response = await fetch('/api/alunos', { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os alunos.')
  }

  return (await response.json()) as AlunoListItem[]
}
