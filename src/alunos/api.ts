import type { AlunoListItem, CreateAlunoInput } from './types'

export async function getAlunos(): Promise<AlunoListItem[]> {
  const response = await fetch('/api/alunos', { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os alunos.')
  }

  return (await response.json()) as AlunoListItem[]
}

export async function createAluno(input: CreateAlunoInput): Promise<AlunoListItem> {
  const response = await fetch('/api/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Não foi possível criar o aluno.')
  }

  return (await response.json()) as AlunoListItem
}
