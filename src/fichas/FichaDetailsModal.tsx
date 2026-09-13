import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  Edit3,
  Layers,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { deleteTrainingPlan, updateTrainingPlan } from './api'
import { ExercisePickerModal } from './ExercisePickerModal'
import type {
  FormDivisionItem,
  FormExerciseItem,
  TrainingPlan,
} from './types'
import type { ExerciseListItem } from '../exercicios/types'
import './FichaDetailsModal.css'

interface FichaDetailsModalProps {
  plan: TrainingPlan | null
  onClose: () => void
  onUpdated: (updatedPlan: TrainingPlan) => void
  onDeleted: (deletedId: number | string) => void
}

export function FichaDetailsModal(props: FichaDetailsModalProps) {
  if (!props.plan) return null
  return <FichaDetailsModalContent key={props.plan.id} {...props} plan={props.plan} />
}

function FichaDetailsModalContent({
  plan,
  onClose,
  onUpdated,
  onDeleted,
}: {
  plan: TrainingPlan
  onClose: () => void
  onUpdated: (updatedPlan: TrainingPlan) => void
  onDeleted: (deletedId: number | string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Edit form state
  const [title, setTitle] = useState(plan.title || '')
  const [notes, setNotes] = useState(plan.notes || '')
  const [startDate, setStartDate] = useState(
    plan.startDate ? plan.startDate.substring(0, 10) : '',
  )
  const [endDate, setEndDate] = useState(
    plan.endDate ? plan.endDate.substring(0, 10) : '',
  )
  const [divisions, setDivisions] = useState<FormDivisionItem[]>(() => {
    if (plan.divisions && plan.divisions.length > 0) {
      return plan.divisions.map((d, dIdx) => ({
        localId: `div-${d.id ?? dIdx}-${Date.now()}`,
        name: d.name,
        notes: d.notes || '',
        exercises: (d.exercises || []).map((ex, exIdx) => ({
          localId: `ex-${ex.id ?? exIdx}-${Date.now()}`,
          exerciseId: ex.exercicioId ?? ex.exerciseId ?? 0,
          exerciseName: ex.exerciseName || 'Exercício',
          muscleGroup: ex.muscleGroup || 'Geral',
          equipment: ex.equipment || undefined,
          sets: ex.sets || 3,
          reps: ex.reps || '8 a 12',
          restInterval: ex.restInterval || '60s',
          targetLoad: ex.targetLoad || '',
          notes: ex.notes || '',
        })),
      }))
    }
    return [
      {
        localId: `div-1-${Date.now()}`,
        name: 'Treino A',
        notes: '',
        exercises: [],
      },
    ]
  })
  const [pickerDivisionLocalId, setPickerDivisionLocalId] = useState<string | null>(null)

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return 'Não definida'
    try {
      return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  const studentDisplayName = plan.studentName || plan.studentEmail || 'Aluno não identificado'

  // --- Deletion ---
  async function handleDelete() {
    setIsDeleting(true)
    setServerError(null)

    try {
      await deleteTrainingPlan(plan.id)
      onDeleted(plan.id)
      onClose()
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao excluir ficha de treino.',
      )
      setIsDeleting(false)
    }
  }

  // --- Edit Form mutations ---
  function addDivision() {
    const nextLetter = String.fromCharCode(65 + divisions.length)
    setDivisions((prev) => [
      ...prev,
      {
        localId: `div-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: `Treino ${nextLetter}`,
        notes: '',
        exercises: [],
      },
    ])
  }

  function removeDivision(divisionLocalId: string) {
    if (divisions.length <= 1) {
      alert('A ficha deve conter pelo menos uma divisão.')
      return
    }
    setDivisions((prev) => prev.filter((d) => d.localId !== divisionLocalId))
  }

  function updateDivisionField(
    divisionLocalId: string,
    field: keyof Omit<FormDivisionItem, 'localId' | 'exercises'>,
    value: string,
  ) {
    setDivisions((prev) =>
      prev.map((d) => (d.localId === divisionLocalId ? { ...d, [field]: value } : d)),
    )
  }

  function handleExerciseSelected(exercise: ExerciseListItem) {
    if (!pickerDivisionLocalId) return

    const newEx: FormExerciseItem = {
      localId: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

    setDivisions((prev) =>
      prev.map((d) =>
        d.localId === pickerDivisionLocalId
          ? { ...d, exercises: [...d.exercises, newEx] }
          : d,
      ),
    )
  }

  function removeExercise(divisionLocalId: string, exerciseLocalId: string) {
    setDivisions((prev) =>
      prev.map((d) =>
        d.localId === divisionLocalId
          ? { ...d, exercises: d.exercises.filter((ex) => ex.localId !== exerciseLocalId) }
          : d,
      ),
    )
  }

  function updateExerciseField(
    divisionLocalId: string,
    exerciseLocalId: string,
    field: keyof Omit<FormExerciseItem, 'localId' | 'exerciseId' | 'exerciseName' | 'muscleGroup' | 'equipment'>,
    value: string | number,
  ) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.localId !== divisionLocalId) return d
        return {
          ...d,
          exercises: d.exercises.map((ex) =>
            ex.localId === exerciseLocalId ? { ...ex, [field]: value } : ex,
          ),
        }
      }),
    )
  }

  // --- Save Updates ---
  async function handleSave() {
    setServerError(null)

    if (title.trim().length < 2) {
      setServerError('O título da ficha deve ter pelo menos 2 caracteres.')
      return
    }

    if (divisions.length === 0) {
      setServerError('A ficha precisa ter pelo menos uma divisão de treino.')
      return
    }

    for (const div of divisions) {
      if (!div.name.trim()) {
        setServerError('Todas as divisões precisam ter um nome.')
        return
      }
      if (div.exercises.length === 0) {
        setServerError(`A divisão "${div.name}" precisa ter pelo menos um exercício.`)
        return
      }
      for (const ex of div.exercises) {
        if (!ex.sets || ex.sets < 1) {
          setServerError(`Séries inválidas no exercício ${ex.exerciseName}.`)
          return
        }
        if (!ex.reps.trim()) {
          setServerError(`Repetições obrigatórias no exercício ${ex.exerciseName}.`)
          return
        }
      }
    }

    setIsSaving(true)

    try {
      const updated = await updateTrainingPlan(plan.id, {
        alunoId: plan.alunoId ?? (Number(plan.studentId) || 1),
        title: title.trim(),
        notes: notes.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        divisions: divisions.map((div, divIndex) => ({
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

      onUpdated(updated)
      setIsEditing(false)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Não foi possível atualizar a ficha.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="ficha-details-modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="ficha-details-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ficha-details-modal__header">
          <div className="ficha-details-modal__header-title">
            <div className="ficha-details-modal__eyebrow-row">
              <span className="ficha-details-modal__eyebrow">
                {isEditing ? 'Editar Ficha de Treino' : 'Ficha de Treino'}
              </span>
              <span
                className={`ficha-details-modal__status-badge is-${plan.status || 'active'}`}
              >
                {plan.status === 'archived' ? 'Arquivado' : 'Ativo'}
              </span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="ficha-details-modal__title-input"
                placeholder="Título da ficha"
              />
            ) : (
              <h2>{plan.title}</h2>
            )}
          </div>

          <div className="ficha-details-modal__header-actions">
            {!isEditing && !showDeleteConfirm && (
              <>
                <button
                  type="button"
                  className="ficha-details-modal__btn-edit"
                  onClick={() => setIsEditing(true)}
                  title="Editar ficha"
                >
                  <Edit3 size={15} /> Editar
                </button>
                <button
                  type="button"
                  className="ficha-details-modal__btn-delete"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Excluir ficha"
                >
                  <Trash2 size={15} /> Excluir
                </button>
              </>
            )}

            <button
              type="button"
              className="ficha-details-modal__close-btn"
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {serverError && (
          <div className="ficha-details-modal__error-banner" role="alert">
            {serverError}
          </div>
        )}

        {/* Delete Confirmation Warning Box */}
        {showDeleteConfirm && (
          <div className="ficha-details-modal__delete-box">
            <div className="ficha-details-modal__delete-box-header">
              <AlertTriangle size={20} />
              <h4>Confirmar exclusão desta ficha de treino?</h4>
            </div>
            <p>
              Esta ação excluirá permanentemente a ficha <strong>{plan.title}</strong> e
              todas as suas divisões e prescrições.
            </p>
            <div className="ficha-details-modal__delete-box-actions">
              <button
                type="button"
                className="ficha-details-modal__btn-cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="ficha-details-modal__btn-confirm-delete"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={15} />
                {isDeleting ? 'Excluindo...' : 'Sim, excluir ficha'}
              </button>
            </div>
          </div>
        )}

        <div className="ficha-details-modal__body">
          {/* Metadata */}
          <div className="ficha-details-modal__meta-card">
            <div className="ficha-details-modal__meta-item">
              <User size={16} className="ficha-details-modal__meta-icon" />
              <div>
                <span className="ficha-details-modal__meta-label">Aluno</span>
                <strong className="ficha-details-modal__meta-value">
                  {studentDisplayName}
                </strong>
                {plan.studentEmail && plan.studentName && (
                  <span className="ficha-details-modal__meta-sub">{plan.studentEmail}</span>
                )}
              </div>
            </div>

            <div className="ficha-details-modal__meta-item">
              <Calendar size={16} className="ficha-details-modal__meta-icon" />
              <div>
                <span className="ficha-details-modal__meta-label">Período / Validade</span>
                {isEditing ? (
                  <div className="ficha-details-modal__date-inputs">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>até</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="ficha-details-modal__meta-value">
                    {formatDate(plan.startDate)} até {formatDate(plan.endDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="ficha-details-modal__meta-item">
              <Layers size={16} className="ficha-details-modal__meta-icon" />
              <div>
                <span className="ficha-details-modal__meta-label">Estrutura</span>
                <span className="ficha-details-modal__meta-value">
                  {isEditing
                    ? `${divisions.length} divisões · ${divisions.reduce((acc, d) => acc + d.exercises.length, 0)} exercícios`
                    : `${plan.divisions?.length || plan.divisionsCount || 0} divisões · ${
                        plan.exercisesCount ??
                        plan.divisions?.reduce((acc, d) => acc + (d.exercises?.length || 0), 0) ??
                        0
                      } exercícios`}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {isEditing ? (
            <div className="ficha-details-modal__field">
              <label>Observações Gerais</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instruções gerais sobre descanso, frequência..."
                rows={2}
              />
            </div>
          ) : (
            plan.notes && (
              <div className="ficha-details-modal__notes-card">
                <strong>Observações Gerais:</strong>
                <p>{plan.notes}</p>
              </div>
            )
          )}

          {/* Workout Divisions */}
          <div className="ficha-details-modal__divisions-section">
            <div className="ficha-details-modal__divisions-header">
              <h3>Divisões de Treino</h3>
              {isEditing && (
                <button
                  type="button"
                  className="ficha-details-modal__btn-add-division"
                  onClick={addDivision}
                >
                  <Plus size={15} /> Adicionar Divisão
                </button>
              )}
            </div>

            {/* VIEW MODE DIVISIONS */}
            {!isEditing && (
              <>
                {(!plan.divisions || plan.divisions.length === 0) && (
                  <p className="ficha-details-modal__empty">
                    Nenhuma divisão de treino detalhada disponível.
                  </p>
                )}

                {plan.divisions?.map((division, divIndex) => (
                  <div key={division.id ?? divIndex} className="ficha-details-division-card">
                    <div className="ficha-details-division-card__header">
                      <span className="ficha-details-division-badge">
                        Divisão {division.order ?? divIndex + 1}
                      </span>
                      <h4>{division.name}</h4>
                      {division.notes && (
                        <span className="ficha-details-division-notes">
                          ({division.notes})
                        </span>
                      )}
                    </div>

                    <div className="ficha-details-exercises-list">
                      {(!division.exercises || division.exercises.length === 0) ? (
                        <p className="ficha-details-modal__empty">
                          Nenhum exercício cadastrado nesta divisão.
                        </p>
                      ) : (
                        <div className="ficha-details-table">
                          <div className="ficha-details-table__head">
                            <span className="col-num">#</span>
                            <span className="col-name">Exercício</span>
                            <span className="col-sets">Séries</span>
                            <span className="col-reps">Repetições</span>
                            <span className="col-rest">Descanso</span>
                            <span className="col-load">Carga</span>
                            <span className="col-notes">Observações</span>
                          </div>

                          {division.exercises.map((ex, exIndex) => (
                            <div key={ex.id ?? exIndex} className="ficha-details-table__row">
                              <span className="col-num">{ex.order ?? exIndex + 1}</span>
                              <div className="col-name">
                                <strong>{ex.exerciseName || `Exercício #${ex.exercicioId ?? ex.exerciseId}`}</strong>
                                {ex.muscleGroup && (
                                  <span className="ficha-details-muscle-tag">
                                    {ex.muscleGroup}
                                  </span>
                                )}
                              </div>
                              <span className="col-sets">
                                <strong>{ex.sets}</strong>
                              </span>
                              <span className="col-reps">{ex.reps}</span>
                              <span className="col-rest">{ex.restInterval || '—'}</span>
                              <span className="col-load">{ex.targetLoad || '—'}</span>
                              <span className="col-notes">{ex.notes || '—'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* EDIT MODE DIVISIONS */}
            {isEditing && (
              <div className="ficha-details-modal__edit-divisions">
                {divisions.map((division, divIndex) => (
                  <div key={division.localId} className="ficha-details-division-card is-editing">
                    <div className="ficha-details-division-card__header">
                      <span className="ficha-details-division-badge">
                        Divisão {divIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={division.name}
                        onChange={(e) =>
                          updateDivisionField(division.localId, 'name', e.target.value)
                        }
                        placeholder="Nome da divisão (ex: Treino A)"
                        className="ficha-details-input-division-name"
                      />
                      <button
                        type="button"
                        className="ficha-details-btn-remove-div"
                        onClick={() => removeDivision(division.localId)}
                        title="Remover divisão"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="ficha-details-division-notes-edit">
                      <input
                        type="text"
                        value={division.notes}
                        onChange={(e) =>
                          updateDivisionField(division.localId, 'notes', e.target.value)
                        }
                        placeholder="Observações da divisão (ex: 5 min aquecimento)"
                      />
                    </div>

                    <div className="ficha-details-exercises-list">
                      {division.exercises.length === 0 ? (
                        <div className="ficha-details-empty-div">
                          <p>Nenhum exercício adicionado a esta divisão.</p>
                          <button
                            type="button"
                            className="ficha-details-btn-add-ex"
                            onClick={() => setPickerDivisionLocalId(division.localId)}
                          >
                            <Plus size={14} /> Adicionar Exercício
                          </button>
                        </div>
                      ) : (
                        <div className="ficha-details-table-edit">
                          <div className="ficha-details-table-edit__head">
                            <span className="col-ex">Exercício</span>
                            <span className="col-s">Séries</span>
                            <span className="col-r">Reps</span>
                            <span className="col-d">Descanso</span>
                            <span className="col-c">Carga</span>
                            <span className="col-obs">Observações</span>
                            <span className="col-act"></span>
                          </div>

                          {division.exercises.map((ex) => (
                            <div key={ex.localId} className="ficha-details-table-edit__row">
                              <div className="col-ex">
                                <strong>{ex.exerciseName}</strong>
                                <span>{ex.muscleGroup}</span>
                              </div>
                              <div className="col-s">
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
                                />
                              </div>
                              <div className="col-r">
                                <input
                                  type="text"
                                  value={ex.reps}
                                  onChange={(e) =>
                                    updateExerciseField(
                                      division.localId,
                                      ex.localId,
                                      'reps',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="col-d">
                                <input
                                  type="text"
                                  value={ex.restInterval}
                                  placeholder="60s"
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
                              <div className="col-c">
                                <input
                                  type="text"
                                  value={ex.targetLoad}
                                  placeholder="Carga"
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
                              <div className="col-obs">
                                <input
                                  type="text"
                                  value={ex.notes}
                                  placeholder="Obs"
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
                              <div className="col-act">
                                <button
                                  type="button"
                                  className="ficha-details-btn-remove-row"
                                  onClick={() => removeExercise(division.localId, ex.localId)}
                                  title="Remover exercício"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          <div className="ficha-details-table-edit__footer">
                            <button
                              type="button"
                              className="ficha-details-btn-add-another-ex"
                              onClick={() => setPickerDivisionLocalId(division.localId)}
                            >
                              <Plus size={14} /> Adicionar outro exercício
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="ficha-details-modal__footer">
          {isEditing ? (
            <>
              <button
                type="button"
                className="ficha-details-modal__btn-cancel-edit"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="ficha-details-modal__btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={16} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="ficha-details-modal__btn-close"
              onClick={onClose}
            >
              Fechar
            </button>
          )}
        </footer>
      </div>

      {/* Exercise Picker Modal inside Edit Mode */}
      <ExercisePickerModal
        isOpen={pickerDivisionLocalId !== null}
        onClose={() => setPickerDivisionLocalId(null)}
        onSelect={handleExerciseSelected}
      />
    </div>
  )
}
