import type { CreateExerciseInput, ExerciseListItem, ExerciseMediaItem } from './types'

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

export interface UploadUrlResponse {
  uploadUrl: string
  objectKey: string
  expiresIn: number
  kind: 'photo' | 'video'
  contentType: string
  byteSize: number
}

export async function requestUploadUrl(
  exerciseId: number,
  kind: 'photo' | 'video',
  file: File,
): Promise<UploadUrlResponse> {
  const response = await fetch(`/api/exercicios/${exerciseId}/upload-url`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind,
      contentType: file.type,
      byteSize: file.size,
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(
      payload.message ||
        `Não foi possível obter autorização para upload ${kind === 'photo' ? 'da foto' : 'do vídeo'}.`,
    )
  }

  return (await response.json()) as UploadUrlResponse
}

export async function uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Falha ao enviar o ficheiro (${file.name}) para o Cloudflare R2.`)
  }
}

export async function confirmUpload(
  exerciseId: number,
  objectKey: string,
  kind: 'photo' | 'video',
  file: File,
): Promise<void> {
  const response = await fetch(`/api/exercicios/${exerciseId}/confirm-upload`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectKey,
      kind,
      contentType: file.type,
      byteSize: file.size,
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(payload.message || 'Não foi possível confirmar o registo do ficheiro de mídia.')
  }
}

export async function updateExercise(
  exerciseId: number,
  input: Partial<CreateExerciseInput>,
): Promise<ExerciseListItem> {
  const response = await fetch(`/api/exercicios/${exerciseId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(payload.message || 'Não foi possível atualizar o exercício.')
  }

  return (await response.json()) as ExerciseListItem
}

export async function deleteExercise(exerciseId: number): Promise<void> {
  const response = await fetch(`/api/exercicios/${exerciseId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(payload.message || 'Não foi possível excluir o exercício.')
  }
}

export async function getExerciseMedia(exerciseId: number): Promise<ExerciseMediaItem[]> {
  const response = await fetch(`/api/exercicios/${exerciseId}/media`, {
    credentials: 'include',
  })

  if (!response.ok) {
    return []
  }

  return (await response.json()) as ExerciseMediaItem[]
}

export async function deleteExerciseMedia(exerciseId: number, mediaId: number): Promise<void> {
  const response = await fetch(`/api/exercicios/${exerciseId}/media/${mediaId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { message?: string }
    throw new Error(payload.message || 'Não foi possível remover o arquivo de mídia.')
  }
}
