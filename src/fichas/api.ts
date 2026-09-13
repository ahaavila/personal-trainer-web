import type {
  CreateTrainingPlanInput,
  CreateTrainingPlanResponse,
  TrainingPlan,
} from './types'

export async function createTrainingPlan(
  input: CreateTrainingPlanInput,
): Promise<CreateTrainingPlanResponse> {
  const response = await fetch('/api/fichas-de-treino', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string | string[]
    }
    const message = Array.isArray(payload.message)
      ? payload.message.join(' · ')
      : payload.message
    throw new Error(message || 'Não foi possível criar a ficha de treino.')
  }

  return (await response.json()) as CreateTrainingPlanResponse
}

export async function getTrainingPlans(): Promise<TrainingPlan[]> {
  const response = await fetch('/api/fichas-de-treino', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar as fichas de treino.')
  }

  return (await response.json()) as TrainingPlan[]
}
