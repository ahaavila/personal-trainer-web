import { useEffect, useState } from 'react'
import { AlertCircle, ImageIcon, Trash2, VideoIcon, X } from 'lucide-react'
import {
  confirmUpload,
  deleteExercise,
  deleteExerciseMedia,
  getExerciseMedia,
  requestUploadUrl,
  updateExercise,
  uploadFileToR2,
} from '../exercicios/api'
import type { CreateExerciseInput, ExerciseLevel, ExerciseListItem, ExerciseMediaItem } from '../exercicios/types'
import './ExerciseModal.css'

interface ExerciseModalProps {
  exercise: ExerciseListItem
  onClose: () => void
  onUpdated: (updated: ExerciseListItem) => void
  onDeleted: (id: number) => void
}

type FieldName = keyof CreateExerciseInput | 'photo' | 'video'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm']
const R2_ENABLED = import.meta.env.VITE_R2_ENABLED === 'true'

export function ExerciseModal({ exercise, onClose, onUpdated, onDeleted }: ExerciseModalProps) {
  const [form, setForm] = useState<CreateExerciseInput>({
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment || '',
    description: exercise.description,
    defaultSets: exercise.defaultSets,
    defaultReps: exercise.defaultReps,
    level: exercise.level,
  })

  const [existingMedia, setExistingMedia] = useState<ExerciseMediaItem[]>([])
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [newVideo, setNewVideo] = useState<File | null>(null)
  const [photoMarkedForRemoval, setPhotoMarkedForRemoval] = useState<number | null>(null)
  const [videoMarkedForRemoval, setVideoMarkedForRemoval] = useState<number | null>(null)

  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (exercise.id) {
      getExerciseMedia(exercise.id).then((items) => {
        if (!cancelled) setExistingMedia(items)
      })
    }
    return () => {
      cancelled = true
    }
  }, [exercise.id])

  const currentPhoto = existingMedia.find((m) => m.kind === 'photo')
  const currentVideo = existingMedia.find((m) => m.kind === 'video')

  function updateField(name: keyof CreateExerciseInput, value: string | number) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validateFile(file: File, kind: 'photo' | 'video') {
    const allowedTypes = kind === 'photo' ? IMAGE_TYPES : VIDEO_TYPES
    const maxSize = kind === 'photo' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE

    if (!allowedTypes.includes(file.type)) {
      return kind === 'photo' ? 'Use uma imagem JPG, PNG ou WebP.' : 'Use um vídeo MP4 ou WebM.'
    }

    if (file.size > maxSize) {
      return kind === 'photo' ? 'A imagem deve ter no máximo 10 MB.' : 'O vídeo deve ter no máximo 100 MB.'
    }

    return null
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {}

    if (form.name.trim().length < 2) nextErrors.name = 'Informe o nome do exercício.'
    if (form.muscleGroup.trim().length < 2) nextErrors.muscleGroup = 'Informe o grupo muscular.'
    if (form.description.trim().length < 10) nextErrors.description = 'Descreva o exercício com pelo menos 10 caracteres.'
    if (!form.defaultReps.trim()) nextErrors.defaultReps = 'Informe as repetições padrão.'
    if (!Number.isFinite(form.defaultSets) || form.defaultSets < 1 || form.defaultSets > 20) {
      nextErrors.defaultSets = 'As séries devem estar entre 1 e 20.'
    }

    if (newPhoto) {
      const err = validateFile(newPhoto, 'photo')
      if (err) nextErrors.photo = err
    }

    if (newVideo) {
      const err = validateFile(newVideo, 'video')
      if (err) nextErrors.video = err
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    if (!validate() || !exercise.id) {
      return
    }

    setIsSubmitting(true)

    try {
      setStatusMessage('A salvar alterações...')
      const updated = await updateExercise(exercise.id, {
        name: form.name.trim(),
        muscleGroup: form.muscleGroup.trim(),
        equipment: form.equipment?.trim() || undefined,
        description: form.description.trim(),
        defaultSets: form.defaultSets,
        defaultReps: form.defaultReps.trim(),
        level: form.level,
      })

      // Handle removals
      if (photoMarkedForRemoval) {
        setStatusMessage('A remover foto antiga...')
        await deleteExerciseMedia(exercise.id, photoMarkedForRemoval)
      }

      if (videoMarkedForRemoval) {
        setStatusMessage('A remover vídeo antigo...')
        await deleteExerciseMedia(exercise.id, videoMarkedForRemoval)
      }

      // Handle new uploads
      if (R2_ENABLED) {
        if (newPhoto) {
          setStatusMessage('A obter autorização para upload da foto...')
          const photoMeta = await requestUploadUrl(exercise.id, 'photo', newPhoto)
          setStatusMessage('A enviar nova foto para o Cloudflare R2...')
          await uploadFileToR2(photoMeta.uploadUrl, newPhoto)
          setStatusMessage('A confirmar registo da nova foto...')
          await confirmUpload(exercise.id, photoMeta.objectKey, 'photo', newPhoto)
        }

        if (newVideo) {
          setStatusMessage('A obter autorização para upload do vídeo...')
          const videoMeta = await requestUploadUrl(exercise.id, 'video', newVideo)
          setStatusMessage('A enviar novo vídeo para o Cloudflare R2...')
          await uploadFileToR2(videoMeta.uploadUrl, newVideo)
          setStatusMessage('A confirmar registo do novo vídeo...')
          await confirmUpload(exercise.id, videoMeta.objectKey, 'video', newVideo)
        }
      }

      onUpdated(updated)
      onClose()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.')
    } finally {
      setIsSubmitting(false)
      setStatusMessage(null)
    }
  }

  async function handleDelete() {
    if (!exercise.id) return
    setIsDeleting(true)
    setServerError(null)

    try {
      await deleteExercise(exercise.id)
      onDeleted(exercise.id)
      onClose()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Não foi possível excluir o exercício.')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="exercise-modal__backdrop" role="dialog" aria-modal="true" aria-labelledby="exercise-modal-title">
      <div className="exercise-modal__content">
        <header className="exercise-modal__header">
          <div>
            <span className="exercise-modal__tag">{form.muscleGroup || 'Exercício'}</span>
            <h2 id="exercise-modal-title">Editar Exercício</h2>
          </div>
          <button type="button" className="exercise-modal__close" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </header>

        {showDeleteConfirm ? (
          <div className="exercise-modal__delete-confirm" role="alertdialog">
            <div className="exercise-modal__delete-icon">
              <AlertCircle size={28} />
            </div>
            <h3>Excluir exercício?</h3>
            <p>
              Tem certeza que deseja remover <strong>"{exercise.name}"</strong>? Esta ação é irreversível.
            </p>
            {serverError && <p className="exercise-modal__error-msg">{serverError}</p>}
            <div className="exercise-modal__delete-actions">
              <button
                type="button"
                className="exercise-modal__btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="exercise-modal__btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'A excluir...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="exercise-modal__form" noValidate>
            <div className="exercise-modal__grid">
              <label className="exercise-modal__field">
                <span>Nome do exercício</span>
                <input
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex.: Supino reto"
                />
                {errors.name && <small className="exercise-modal__error">{errors.name}</small>}
              </label>

              <label className="exercise-modal__field">
                <span>Grupo muscular</span>
                <input
                  value={form.muscleGroup}
                  onChange={(e) => updateField('muscleGroup', e.target.value)}
                  placeholder="Ex.: Peito"
                />
                {errors.muscleGroup && <small className="exercise-modal__error">{errors.muscleGroup}</small>}
              </label>
            </div>

            <div className="exercise-modal__grid exercise-modal__grid--three">
              <label className="exercise-modal__field">
                <span>Equipamento</span>
                <input
                  value={form.equipment}
                  onChange={(e) => updateField('equipment', e.target.value)}
                  placeholder="Opcional"
                />
                {errors.equipment && <small className="exercise-modal__error">{errors.equipment}</small>}
              </label>

              <label className="exercise-modal__field">
                <span>Nível</span>
                <select
                  value={form.level}
                  onChange={(e) => updateField('level', e.target.value as ExerciseLevel)}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </label>

              <label className="exercise-modal__field">
                <span>Séries padrão</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.defaultSets}
                  onChange={(e) => updateField('defaultSets', Number(e.target.value))}
                />
                {errors.defaultSets && <small className="exercise-modal__error">{errors.defaultSets}</small>}
              </label>
            </div>

            <div className="exercise-modal__grid">
              <label className="exercise-modal__field">
                <span>Repetições padrão</span>
                <input
                  value={form.defaultReps}
                  onChange={(e) => updateField('defaultReps', e.target.value)}
                  placeholder="Ex.: 8 a 12"
                />
                {errors.defaultReps && <small className="exercise-modal__error">{errors.defaultReps}</small>}
              </label>
            </div>

            <label className="exercise-modal__field">
              <span>Descrição / Execução</span>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="Descreva a execução do exercício..."
              />
              {errors.description && <small className="exercise-modal__error">{errors.description}</small>}
            </label>

            {/* Media Section */}
            <section className="exercise-modal__media-section">
              <h3>Mídia de Execução</h3>

              {R2_ENABLED ? (
                <div className="exercise-modal__media-grid">
                  {/* Photo management */}
                  <div className="exercise-modal__media-card">
                    <div className="exercise-modal__media-card-header">
                      <span className="exercise-modal__media-icon"><ImageIcon size={16} /></span>
                      <strong>Foto</strong>
                    </div>

                    {currentPhoto && !photoMarkedForRemoval ? (
                      <div className="exercise-modal__media-preview">
                        {currentPhoto.url ? (
                          <img src={currentPhoto.url} alt="Foto do exercício" className="exercise-modal__thumb" />
                        ) : (
                          <div className="exercise-modal__file-badge">Foto anexada ({formatBytes(currentPhoto.byteSize)})</div>
                        )}
                        <button
                          type="button"
                          className="exercise-modal__btn-remove-media"
                          onClick={() => {
                            if (currentPhoto.id) setPhotoMarkedForRemoval(currentPhoto.id)
                          }}
                        >
                          <Trash2 size={14} /> Remover foto
                        </button>
                      </div>
                    ) : (
                      <label className="exercise-modal__upload-label">
                        <span>{photoMarkedForRemoval ? 'Foto removida. Selecionar nova:' : 'Selecionar nova foto:'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => setNewPhoto(e.target.files?.[0] ?? null)}
                        />
                        <small className={newPhoto ? 'is-selected' : ''}>
                          {newPhoto ? `${newPhoto.name} (${formatBytes(newPhoto.size)})` : 'Nenhum arquivo'}
                        </small>
                      </label>
                    )}
                    {errors.photo && <small className="exercise-modal__error">{errors.photo}</small>}
                  </div>

                  {/* Video management */}
                  <div className="exercise-modal__media-card">
                    <div className="exercise-modal__media-card-header">
                      <span className="exercise-modal__media-icon"><VideoIcon size={16} /></span>
                      <strong>Vídeo</strong>
                    </div>

                    {currentVideo && !videoMarkedForRemoval ? (
                      <div className="exercise-modal__media-preview">
                        {currentVideo.url ? (
                          <video src={currentVideo.url} controls className="exercise-modal__video-thumb" />
                        ) : (
                          <div className="exercise-modal__file-badge">Vídeo anexado ({formatBytes(currentVideo.byteSize)})</div>
                        )}
                        <button
                          type="button"
                          className="exercise-modal__btn-remove-media"
                          onClick={() => {
                            if (currentVideo.id) setVideoMarkedForRemoval(currentVideo.id)
                          }}
                        >
                          <Trash2 size={14} /> Remover vídeo
                        </button>
                      </div>
                    ) : (
                      <label className="exercise-modal__upload-label">
                        <span>{videoMarkedForRemoval ? 'Vídeo removido. Selecionar novo:' : 'Selecionar novo vídeo:'}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={(e) => setNewVideo(e.target.files?.[0] ?? null)}
                        />
                        <small className={newVideo ? 'is-selected' : ''}>
                          {newVideo ? `${newVideo.name} (${formatBytes(newVideo.size)})` : 'Nenhum arquivo'}
                        </small>
                      </label>
                    )}
                    {errors.video && <small className="exercise-modal__error">{errors.video}</small>}
                  </div>
                </div>
              ) : (
                <div className="exercise-modal__media-disabled">
                  Mídia desativada neste ambiente (Cloudflare R2 desativado).
                </div>
              )}
            </section>

            {statusMessage && <p className="exercise-modal__status-msg" role="status">{statusMessage}</p>}
            {serverError && <p className="exercise-modal__error-msg">{serverError}</p>}

            <footer className="exercise-modal__footer">
              <button
                type="button"
                className="exercise-modal__btn-delete"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                <Trash2 size={16} />
                Excluir
              </button>

              <div className="exercise-modal__footer-right">
                <button
                  type="button"
                  className="exercise-modal__btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="exercise-modal__btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (statusMessage || 'A salvar...') : 'Salvar alterações'}
                </button>
              </div>
            </footer>
          </form>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}
