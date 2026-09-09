import type { ExerciseListItem } from './types'

export async function getExercises(): Promise<ExerciseListItem[]> {
  const response = await fetch('/api/exercicios', { credentials: 'include' })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os exercícios.')
  }

  return (await response.json()) as ExerciseListItem[]
}
