import type { CreateExerciseInput, ExerciseListItem } from './types'

export async function getExercises(): Promise<ExerciseListItem[]> {
  const response = await fetch('/api/exercicios', { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os exercícios.')
  }

  return (await response.json()) as ExerciseListItem[]
}

export async function createExercise(input: CreateExerciseInput): Promise<ExerciseListItem> {
  const response = await fetch('/api/exercicios', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as { message?: string }
    throw new Error(payload.message || 'Não foi possível criar o exercício.')
  }

  return (await response.json()) as ExerciseListItem
}
