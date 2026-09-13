import { useEffect, useState } from 'react'
import {
  Dumbbell,
  Layers,
  Plus,
  Save,
  Trash2,
  User,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { getAlunos } from '../alunos/api'
import type { AlunoListItem } from '../alunos/types'
import { createTrainingPlan } from '../fichas/api'
import { ExercisePickerModal } from '../fichas/ExercisePickerModal'
import type {
  FormDivisionItem,
  FormExerciseItem,
  PlanFormValues,
} from '../fichas/types'
import type { ExerciseListItem } from '../exercicios/types'
import './NovaFichaTreinoPage.css'

const INITIAL_FORM: PlanFormValues = {
  alunoId: '',
  title: '',
  notes: '',
  startDate: '',
  endDate: '',
  divisions: [
    {
      localId: 'div-1',
      name: 'Treino A',
      notes: '',
      exercises: [],
    },
  ],
}

interface ValidationErrors {
  alunoId?: string
  title?: string
  general?: string
  divisions?: Record<string, { name?: string; exercises?: string }>
  exercises?: Record<string, { sets?: string; reps?: string }>
}

export default function NovaFichaTreinoPage() {
  const navigate = useNavigate()

  const [alunos, setAlunos] = useState<AlunoListItem[]>([])
  const [loadingAlunos, setLoadingAlunos] = useState(true)
  const [form, setForm] = useState<PlanFormValues>(INITIAL_FORM)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Exercise Picker Modal state
  const [pickerDivisionLocalId, setPickerDivisionLocalId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getAlunos()
      .then((data) => {
        if (isMounted) {
          setAlunos(data)
          setLoadingAlunos(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Erro ao buscar alunos:', err)
          setLoadingAlunos(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  function updateField<K extends keyof Omit<PlanFormValues, 'divisions'>>(
    key: K,
    value: PlanFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // --- Divisions management ---
  function addDivision() {
    const nextLetter = String.fromCharCode(65 + form.divisions.length) // A, B, C, D...
    const newDiv: FormDivisionItem = {
      localId: `div-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `Treino ${nextLetter}`,
      notes: '',
      exercises: [],
    }

    setForm((prev) => ({
      ...prev,
      divisions: [...prev.divisions, newDiv],
    }))
  }

  function removeDivision(divisionLocalId: string) {
    if (form.divisions.length <= 1) {
      alert('A ficha de treino deve conter pelo menos uma divisão.')
      return
    }

    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.filter((d) => d.localId !== divisionLocalId),
    }))
  }

  function updateDivision(
    divisionLocalId: string,
    field: keyof Omit<FormDivisionItem, 'localId' | 'exercises'>,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.map((d) =>
        d.localId === divisionLocalId ? { ...d, [field]: value } : d,
      ),
    }))

    setErrors((prev) => {
      if (!prev.divisions?.[divisionLocalId]) return prev
      return {
        ...prev,
        divisions: {
          ...prev.divisions,
          [divisionLocalId]: {
            ...prev.divisions[divisionLocalId],
            [field]: undefined,
          },
        },
      }
    })
  }

  // --- Exercise management within division ---
  function handleExerciseSelected(exercise: ExerciseListItem) {
    if (!pickerDivisionLocalId) return

    const newEx: FormExerciseItem = {
      localId: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      exerciseId: exercise.id ?? Date.now(),
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps || '8 a 12',
      restInterval: '60s',
      targetLoad: '',
      notes: '',
    }

    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.map((d) =>
        d.localId === pickerDivisionLocalId
          ? { ...d, exercises: [...d.exercises, newEx] }
          : d,
      ),
    }))

    setErrors((prev) => {
      if (!prev.divisions?.[pickerDivisionLocalId]) return prev
      return {
        ...prev,
        divisions: {
          ...prev.divisions,
          [pickerDivisionLocalId]: {
            ...prev.divisions[pickerDivisionLocalId],
            exercises: undefined,
          },
        },
      }
    })
  }

  function removeExercise(divisionLocalId: string, exerciseLocalId: string) {
    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.map((d) =>
        d.localId === divisionLocalId
          ? { ...d, exercises: d.exercises.filter((ex) => ex.localId !== exerciseLocalId) }
          : d,
      ),
    }))
  }

  function updateExerciseField(
    divisionLocalId: string,
    exerciseLocalId: string,
    field: keyof Omit<FormExerciseItem, 'localId' | 'exerciseId' | 'exerciseName' | 'muscleGroup' | 'equipment'>,
    value: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      divisions: prev.divisions.map((d) => {
        if (d.localId !== divisionLocalId) return d
        return {
          ...d,
          exercises: d.exercises.map((ex) =>
            ex.localId === exerciseLocalId ? { ...ex, [field]: value } : ex,
          ),
        }
      }),
    }))

    setErrors((prev) => {
      if (!prev.exercises?.[exerciseLocalId]) return prev
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseLocalId]: {
            ...prev.exercises[exerciseLocalId],
            [field]: undefined,
          },
        },
      }
    })
  }

  // --- Validation ---
  function validate(): boolean {
    const nextErrors: ValidationErrors = {}
    let isValid = true

    if (!form.alunoId || Number(form.alunoId) < 1) {
      nextErrors.alunoId = 'Selecione o aluno para vincular a esta ficha.'
      isValid = false
    }

    if (form.title.trim().length < 2) {
      nextErrors.title = 'O título da ficha deve ter pelo menos 2 caracteres.'
      isValid = false
    }

    if (form.divisions.length === 0) {
      nextErrors.general = 'Adicione pelo menos uma divisão de treino à ficha.'
      isValid = false
    }

    const divisionErrors: Record<string, { name?: string; exercises?: string }> = {}
    const exerciseErrors: Record<string, { sets?: string; reps?: string }> = {}

    form.divisions.forEach((div) => {
      if (!div.name.trim()) {
        divisionErrors[div.localId] = {
          ...divisionErrors[div.localId],
          name: 'Informe o nome da divisão.',
        }
        isValid = false
      }

      if (div.exercises.length === 0) {
        divisionErrors[div.localId] = {
          ...divisionErrors[div.localId],
          exercises: 'Adicione pelo menos um exercício nesta divisão.',
        }
        isValid = false
      }

      div.exercises.forEach((ex) => {
        if (!ex.sets || Number(ex.sets) < 1) {
          exerciseErrors[ex.localId] = {
            ...exerciseErrors[ex.localId],
            sets: 'Mínimo 1 série.',
          }
          isValid = false
        }
        if (!ex.reps.trim()) {
          exerciseErrors[ex.localId] = {
            ...exerciseErrors[ex.localId],
            reps: 'Informe as repetições.',
          }
          isValid = false
        }
      })
    })

    if (Object.keys(divisionErrors).length > 0) {
      nextErrors.divisions = divisionErrors
    }
    if (Object.keys(exerciseErrors).length > 0) {
      nextErrors.exercises = exerciseErrors
    }

    setErrors(nextErrors)
    return isValid
  }

  // --- Submission ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)

    if (!validate()) return

    setIsSubmitting(true)

    try {
      await createTrainingPlan({
        alunoId: Number(form.alunoId),
        title: form.title.trim(),
        notes: form.notes.trim() || undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        divisions: form.divisions.map((div, divIndex) => ({
          name: div.name.trim(),
          order: divIndex + 1,
          notes: div.notes.trim() || undefined,
          exercises: div.exercises.map((ex, exIndex) => ({
            exercicioId: ex.exerciseId,
            order: exIndex + 1,
            sets: Number(ex.sets),
            reps: ex.reps.trim(),
            restInterval: ex.restInterval.trim() || undefined,
            targetLoad: ex.targetLoad.trim() || undefined,
            notes: ex.notes.trim() || undefined,
          })),
        })),
      })

      navigate('/treinos', {
        state: { createdPlan: form.title.trim() },
      })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Ocorreu um erro ao salvar a ficha de treino.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="nova-ficha-page">
      <header className="nova-ficha-page__header">
        <div>
          <h1>Criar ficha de treino</h1>
          <p>Monte o planejamento completo de treino com divisões e exercícios personalizados.</p>
        </div>
        <Link to="/treinos" className="nova-ficha-page__back">
          Voltar para treinos
        </Link>
      </header>

      <form className="nova-ficha-form" onSubmit={handleSubmit} noValidate>
        {/* Section 1: General Info */}
        <section className="nova-ficha-card">
          <div className="nova-ficha-card__header">
            <User className="nova-ficha-card__icon" size={20} />
            <div>
              <h2>1. Identificação e Aluno</h2>
              <p>Selecione o aluno e defina o nome principal desta ficha.</p>
            </div>
          </div>

          <div className="nova-ficha-form__grid">
            <label className="nova-ficha-field">
              <span>Aluno *</span>
              <select
                value={form.alunoId}
                onChange={(e) =>
                  updateField('alunoId', e.target.value ? Number(e.target.value) : '')
                }
                disabled={loadingAlunos}
              >
                <option value="">
                  {loadingAlunos ? 'Carregando alunos...' : 'Selecione um aluno da sua lista'}
                </option>
                {alunos.map((aluno) => (
                  <option
                    key={aluno.id ?? aluno.email}
                    value={aluno.id !== undefined ? String(aluno.id) : aluno.email}
                  >
                    {aluno.name} ({aluno.email}) · {aluno.objective}
                  </option>
                ))}
              </select>
              {errors.alunoId && (
                <small className="nova-ficha-error" role="alert">
                  {errors.alunoId}
                </small>
              )}
            </label>

            <label className="nova-ficha-field">
              <span>Título da Ficha *</span>
              <input
                type="text"
                placeholder="Ex: Hipertrofia A/B/C - Fase 1"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
              {errors.title && (
                <small className="nova-ficha-error" role="alert">
                  {errors.title}
                </small>
              )}
            </label>
          </div>

          <div className="nova-ficha-form__grid">
            <label className="nova-ficha-field">
              <span>Data de Início</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
            </label>

            <label className="nova-ficha-field">
              <span>Data de Término / Validade</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
              />
            </label>
          </div>

          <label className="nova-ficha-field">
            <span>Observações e Recomendações Gerais</span>
            <textarea
              placeholder="Instruções gerais sobre descanso, aquecimento cardiovascular, frequência semanal..."
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
            />
          </label>
        </section>

        {/* Section 2: Workout Divisions Builder */}
        <section className="nova-ficha-card">
          <div className="nova-ficha-card__header-with-action">
            <div className="nova-ficha-card__header">
              <Layers className="nova-ficha-card__icon" size={20} />
              <div>
                <h2>2. Divisões e Prescrição de Exercícios</h2>
                <p>Estruture as rotinas de treino (A, B, C...) e adicione os exercícios prescritos.</p>
              </div>
            </div>

            <button
              type="button"
              className="nova-ficha-btn-secondary"
              onClick={addDivision}
            >
              <Plus size={16} /> Adicionar Divisão
            </button>
          </div>

          {errors.general && (
            <div className="nova-ficha-alert-error" role="alert">
              {errors.general}
            </div>
          )}

          <div className="nova-ficha-divisions-list">
            {form.divisions.map((division, divIndex) => {
              const divError = errors.divisions?.[division.localId]

              return (
                <div key={division.localId} className="nova-ficha-division-card">
                  <header className="nova-ficha-division-card__header">
                    <div className="nova-ficha-division-card__title-inputs">
                      <span className="nova-ficha-division-badge">
                        Divisão {divIndex + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Nome da divisão (ex: Treino A - Peito e Tríceps)"
                        value={division.name}
                        onChange={(e) =>
                          updateDivision(division.localId, 'name', e.target.value)
                        }
                        className="nova-ficha-division-name-input"
                      />
                    </div>

                    <button
                      type="button"
                      className="nova-ficha-division-delete-btn"
                      onClick={() => removeDivision(division.localId)}
                      title="Excluir divisão"
                      aria-label="Excluir divisão"
                    >
                      <Trash2 size={16} />
                    </button>
                  </header>

                  {divError?.name && (
                    <small className="nova-ficha-error" role="alert">
                      {divError.name}
                    </small>
                  )}

                  <div className="nova-ficha-division-notes">
                    <input
                      type="text"
                      placeholder="Observações da divisão (ex: 5 min esteira aquecimento)"
                      value={division.notes}
                      onChange={(e) =>
                        updateDivision(division.localId, 'notes', e.target.value)
                      }
                    />
                  </div>

                  {/* Exercises list */}
                  <div className="nova-ficha-exercises-table-wrap">
                    {division.exercises.length === 0 ? (
                      <div className="nova-ficha-exercises-empty">
                        <Dumbbell size={28} />
                        <p>Nenhum exercício adicionado a esta divisão.</p>
                        <button
                          type="button"
                          className="nova-ficha-btn-add-exercise"
                          onClick={() => setPickerDivisionLocalId(division.localId)}
                        >
                          <Plus size={16} /> Adicionar Exercício
                        </button>
                      </div>
                    ) : (
                      <div className="nova-ficha-exercises-table">
                        <div className="nova-ficha-table-head">
                          <span className="col-exercise">Exercício</span>
                          <span className="col-sets">Séries</span>
                          <span className="col-reps">Repetições</span>
                          <span className="col-rest">Descanso</span>
                          <span className="col-load">Carga</span>
                          <span className="col-notes">Observações</span>
                          <span className="col-actions"></span>
                        </div>

                        {division.exercises.map((ex, exIndex) => {
                          const exError = errors.exercises?.[ex.localId]

                          return (
                            <div key={ex.localId} className="nova-ficha-table-row">
                              <div className="col-exercise">
                                <span className="nova-ficha-ex-index">{exIndex + 1}</span>
                                <div>
                                  <strong className="nova-ficha-ex-name">{ex.exerciseName}</strong>
                                  <span className="nova-ficha-ex-muscle">{ex.muscleGroup}</span>
                                </div>
                              </div>

                              <div className="col-sets">
                                <input
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={ex.sets}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'sets',
                                      Number(e.target.value),
                                    )
                                  }
                                  className={exError?.sets ? 'is-invalid' : ''}
                                />
                              </div>

                              <div className="col-reps">
                                <input
                                  type="text"
                                  placeholder="Ex: 8 a 12"
                                  value={ex.reps}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'reps',
                                      e.target.value,
                                    )
                                  }
                                  className={exError?.reps ? 'is-invalid' : ''}
                                />
                              </div>

                              <div className="col-rest">
                                <input
                                  type="text"
                                  placeholder="60s"
                                  value={ex.restInterval}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'restInterval',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-load">
                                <input
                                  type="text"
                                  placeholder="Ex: 20kg"
                                  value={ex.targetLoad}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'targetLoad',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-notes">
                                <input
                                  type="text"
                                  placeholder="Ex: Drop-set na última"
                                  value={ex.notes}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'notes',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>

                              <div className="col-actions">
                                <button
                                  type="button"
                                  className="nova-ficha-row-delete-btn"
                                  onClick={() => removeExercise(division.localId, ex.localId)}
                                  title="Remover exercício"
                                  aria-label="Remover exercício"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        <div className="nova-ficha-table-footer">
                          <button
                            type="button"
                            className="nova-ficha-btn-add-more-exercise"
                            onClick={() => setPickerDivisionLocalId(division.localId)}
                          >
                            <Plus size={15} /> Adicionar outro exercício a esta divisão
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {divError?.exercises && (
                    <small className="nova-ficha-error" role="alert">
                      {divError.exercises}
                    </small>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {serverError && (
          <p className="nova-ficha-server-error" role="alert">
            {serverError}
          </p>
        )}

        <footer className="nova-ficha-form__footer">
          <Link to="/treinos" className="nova-ficha-btn-cancel">
            Cancelar
          </Link>
          <button
            type="submit"
            className="nova-ficha-btn-submit"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? 'Salvando Ficha...' : 'Criar e Salvar Ficha de Treino'}
          </button>
        </footer>
      </form>

      {/* Modal for selecting exercises from the library */}
      <ExercisePickerModal
        isOpen={pickerDivisionLocalId !== null}
        onClose={() => setPickerDivisionLocalId(null)}
        onSelect={handleExerciseSelected}
      />
    </main>
  )
}
