import type { StudentProgressData } from './types'

export async function getStudentProgress(alunoId: number): Promise<StudentProgressData> {
  const response = await fetch(`/api/alunos/${alunoId}/progresso`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorData?.message || 'Não foi possível carregar o progresso do aluno.')
  }

  return (await response.json()) as StudentProgressData
}
