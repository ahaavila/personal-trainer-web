import type { CreateWorkoutExecutionPayload, StudentProgressData, WorkoutSessionLog } from './types'

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

export async function logWorkoutExecution(payload: CreateWorkoutExecutionPayload): Promise<WorkoutSessionLog> {
  const response = await fetch('/api/treinos/execucoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(errorData?.message || 'Não foi possível registrar a execução do treino.')
  }

  return (await response.json()) as WorkoutSessionLog
}
