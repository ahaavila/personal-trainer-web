import { useState } from 'react'
import { ArrowLeft, ImageIcon, Save, VideoIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { createExercise } from '../exercicios/api'
import type { CreateExerciseInput, ExerciseLevel } from '../exercicios/types'
import './NovoExercicioPage.css'

type FormValues = CreateExerciseInput & {
  photo: File | null
  video: File | null
}

type FieldName = keyof Omit<FormValues, 'photo' | 'video'> | 'photo' | 'video'

const INITIAL_FORM: FormValues = {
  name: '',
  muscleGroup: '',
  equipment: '',
  description: '',
  defaultSets: 3,
  defaultReps: '8 a 12',
  level: 'iniciante',
  photo: null,
  video: null,
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm']
const R2_ENABLED = import.meta.env.VITE_R2_ENABLED === 'true'

function NovoExercicioPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(name: keyof Omit<FormValues, 'photo' | 'video'>, value: string | number) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function updateFile(name: 'photo' | 'video', file: File | null) {
    setForm((current) => ({ ...current, [name]: file }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validateFile(file: File, kind: 'photo' | 'video') {
    const allowedTypes = kind === 'photo' ? IMAGE_TYPES : VIDEO_TYPES
    const maxSize = kind === 'photo' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE

    if (!allowedTypes.includes(file.type)) {
      return kind === 'photo'
        ? 'Use uma imagem JPG, PNG ou WebP.'
        : 'Use um vídeo MP4 ou WebM.'
    }

    if (file.size > maxSize) {
      return kind === 'photo'
        ? 'A imagem deve ter no máximo 10 MB.'
        : 'O vídeo deve ter no máximo 100 MB.'
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

    if (form.photo && !R2_ENABLED) {
      nextErrors.photo = 'Upload de mídia indisponível neste ambiente (R2 desativado).'
    }

    if (form.video && !R2_ENABLED) {
      nextErrors.video = 'Upload de mídia indisponível neste ambiente (R2 desativado).'
    }

    if (form.photo) {
      const photoError = validateFile(form.photo, 'photo')
      if (photoError) nextErrors.photo = photoError
    }

    if (form.video) {
      const videoError = validateFile(form.video, 'video')
      if (videoError) nextErrors.video = videoError
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createExercise({
        name: form.name.trim(),
        muscleGroup: form.muscleGroup.trim(),
        equipment: form.equipment?.trim() || undefined,
        description: form.description.trim(),
        defaultSets: form.defaultSets,
        defaultReps: form.defaultReps.trim(),
        level: form.level,
      })

      navigate('/exercicios', { replace: true })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Não foi possível criar o exercício.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="novo-exercicio-page">
      <header className="novo-exercicio-page__header">
        <div>
          <span>Biblioteca</span>
          <h1>Novo exercício</h1>
          <p>Adicione um exercício à biblioteca para usar nas fichas.</p>
        </div>
        <Link to="/exercicios" className="novo-exercicio-page__back">
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </header>

      <form className="novo-exercicio-form" onSubmit={handleSubmit} noValidate>
        <section>
          <div className="novo-exercicio-form__grid">
            <Field label="Nome do exercício" error={errors.name}>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Ex.: Agachamento livre"
              />
            </Field>

            <Field label="Grupo muscular" error={errors.muscleGroup}>
              <input
                value={form.muscleGroup}
                onChange={(event) => updateField('muscleGroup', event.target.value)}
                placeholder="Ex.: Pernas"
              />
            </Field>
          </div>

          <div className="novo-exercicio-form__grid novo-exercicio-form__grid--three">
            <Field label="Equipamento" error={errors.equipment}>
              <input
                value={form.equipment}
                onChange={(event) => updateField('equipment', event.target.value)}
                placeholder="Opcional"
              />
            </Field>

            <Field label="Nível" error={errors.level}>
              <select
                value={form.level}
                onChange={(event) => updateField('level', event.target.value as ExerciseLevel)}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </Field>

            <Field label="Séries padrão" error={errors.defaultSets}>
              <input
                type="number"
                min={1}
                max={20}
                value={form.defaultSets}
                onChange={(event) => updateField('defaultSets', Number(event.target.value))}
              />
            </Field>
          </div>

          <div className="novo-exercicio-form__grid nova-exercicio-form__grid--two">
            <Field label="Repetições padrão" error={errors.defaultReps}>
              <input
                value={form.defaultReps}
                onChange={(event) => updateField('defaultReps', event.target.value)}
                placeholder="Ex.: 8 a 12"
              />
            </Field>
          </div>

          <Field label="Descrição" error={errors.description}>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={4}
              placeholder="Descreva a execução, a posição e o objetivo principal do exercício."
            />
          </Field>
        </section>

        <section>
          <h2>Mídia do exercício</h2>
          <p>Use fotos ou vídeos para reforçar a execução do movimento.</p>

          {R2_ENABLED ? (
            <div className="novo-exercicio-form__media-grid">
              <label className="novo-exercicio-form__upload">
                <span className="novo-exercicio-form__upload-icon"><ImageIcon size={18} /></span>
                <span>Foto da execução (opcional)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => updateFile('photo', event.target.files?.[0] ?? null)}
                />
                <small className={`novo-exercicio-form__upload-status ${form.photo ? 'is-selected' : ''}`} aria-live="polite">
                  {form.photo ? `Selecionado: ${form.photo.name} (${formatBytes(form.photo.size)})` : 'Nenhum arquivo selecionado'}
                </small>
              </label>

              <label className="novo-exercicio-form__upload">
                <span className="novo-exercicio-form__upload-icon"><VideoIcon size={18} /></span>
                <span>Vídeo da execução (opcional)</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(event) => updateFile('video', event.target.files?.[0] ?? null)}
                />
                <small className={`novo-exercicio-form__upload-status ${form.video ? 'is-selected' : ''}`} aria-live="polite">
                  {form.video ? `Selecionado: ${form.video.name} (${formatBytes(form.video.size)})` : 'Nenhum arquivo selecionado'}
                </small>
              </label>
            </div>
          ) : (
            <div className="novo-exercicio-form__media-disabled" role="status">
              O upload de mídia está indisponível neste ambiente porque o Cloudflare R2 está desligado. O exercício continua a poder ser criado sem imagem ou vídeo.
            </div>
          )}

          {errors.photo && <small className="novo-exercicio-form__error" role="alert">{errors.photo}</small>}
          {errors.video && <small className="novo-exercicio-form__error" role="alert">{errors.video}</small>}
        </section>

        {serverError && <p className="novo-exercicio-form__server-error" role="alert">{serverError}</p>}

        <footer>
          <Link to="/exercicios">Cancelar</Link>
          <button type="submit" disabled={isSubmitting}>
            <Save size={18} />
            {isSubmitting ? 'A guardar...' : 'Guardar exercício'}
          </button>
        </footer>
      </form>
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="novo-exercicio-form__field">
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

export default NovoExercicioPage
