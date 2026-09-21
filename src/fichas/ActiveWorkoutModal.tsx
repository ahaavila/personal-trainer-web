import { useEffect, useState } from 'react'
import { Check, CheckCircle2, Clock, Hourglass, Pause, Play, Trophy, Video } from 'lucide-react'
import { RestCountdownPopup } from './RestCountdownPopup'
import { ExerciseMediaViewerModal } from '../exercicios/ExerciseMediaViewerModal'
import type { TrainingPlanDivision, TrainingPlanDivisionExercise } from './types'
import type { CreateWorkoutExecutionPayload } from '../progresso/types'
import './ActiveWorkoutModal.css'

interface SetRecord {
  weightKg: string
  reps: string
  completed: boolean
}

interface ExerciseRecord {
  exerciseId: number
  exerciseName: string
  muscleGroup: string
  sets: SetRecord[]
}

interface ActiveWorkoutModalProps {
  division: TrainingPlanDivision
  planTitle: string
  studentEmail: string
  onClose: () => void
  onFinish: (payload: CreateWorkoutExecutionPayload) => Promise<void>
}

const STORAGE_PREFIX = 'fitforge:active_workout:'
const REST_PRESETS = [30, 45, 60, 90, 120]

function parseRestSeconds(interval?: string | null): number {
  if (!interval) return 60
  const match = interval.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 60
}

export function ActiveWorkoutModal({
  division,
  planTitle,
  studentEmail,
  onClose,
  onFinish,
}: ActiveWorkoutModalProps) {
  const storageKey = `${STORAGE_PREFIX}${studentEmail}:${division.id}`

  // Timer state
  const [startTime, setStartTime] = useState<number>(() => Date.now())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedElapsed, setPausedElapsed] = useState(0)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Configured rest seconds chosen by student
  const [selectedRestSeconds, setSelectedRestSeconds] = useState<number>(() => {
    return parseRestSeconds(division.exercises[0]?.restInterval) || 60
  })

  // Rest countdown popup state
  const [activeRestPopup, setActiveRestPopup] = useState<{
    initialSeconds: number
    exerciseName: string
    completedSetNumber: number
    nextInfo?: string
  } | null>(null)

  // Exercise media modal state
  const [selectedExerciseForMedia, setSelectedExerciseForMedia] = useState<TrainingPlanDivisionExercise | null>(null)

  // Exercises tracking state
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>(() => {
    // Try restore from localStorage
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.exerciseRecords) {
          return parsed.exerciseRecords
        }
      }
    } catch {
      // Ignore
    }

    // Default initialization from division
    return division.exercises.map((ex) => {
      const setCount = ex.sets || 3
      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        sets: Array.from({ length: setCount }, () => ({
          weightKg: ex.targetLoad ? ex.targetLoad.replace(/[^0-9.]/g, '') : '',
          reps: ex.reps ? ex.reps.split(' ')[0] : '10',
          completed: false,
        })),
      }
    })
  })

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (!isPaused) {
      interval = setInterval(() => {
        const now = Date.now()
        setElapsedSeconds(pausedElapsed + Math.floor((now - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPaused, startTime, pausedElapsed])

  // Save progress in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          divisionId: division.id,
          startTime,
          pausedElapsed: elapsedSeconds,
          exerciseRecords,
          notes,
        }),
      )
    } catch {
      // Ignore
    }
  }, [storageKey, division.id, startTime, elapsedSeconds, exerciseRecords, notes])

  const togglePause = () => {
    if (!isPaused) {
      setPausedElapsed(elapsedSeconds)
      setIsPaused(true)
    } else {
      setStartTime(Date.now())
      setIsPaused(false)
    }
  }

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps' | 'completed',
    value: string | boolean,
  ) => {
    setExerciseRecords((current) => {
      const copy = [...current]
      const ex = { ...copy[exerciseIndex] }
      const sets = [...ex.sets]
      sets[setIndex] = { ...sets[setIndex], [field]: value }
      ex.sets = sets
      copy[exerciseIndex] = ex
      return copy
    })

    // If set was just marked as completed, trigger rest countdown popup
    if (field === 'completed' && value === true) {
      const currentEx = exerciseRecords[exerciseIndex]
      const prescription = division.exercises[exerciseIndex]
      const restDuration = prescription?.restInterval
        ? parseRestSeconds(prescription.restInterval)
        : selectedRestSeconds

      let nextInfo: string
      if (setIndex + 1 < currentEx.sets.length) {
        nextInfo = `Próxima: Série #${setIndex + 2} de ${currentEx.exerciseName}`
      } else if (exerciseIndex + 1 < exerciseRecords.length) {
        nextInfo = `Próximo exercício: ${exerciseRecords[exerciseIndex + 1].exerciseName}`
      } else {
        nextInfo = 'Última série concluída! Pode finalizar o seu treino.'
      }

      setActiveRestPopup({
        initialSeconds: restDuration,
        exerciseName: currentEx.exerciseName,
        completedSetNumber: setIndex + 1,
        nextInfo,
      })
    }
  }

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleFinishWorkout = async () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60))
    const startedAt = new Date(startTime).toISOString()
    const completedAt = new Date().toISOString()

    const exerciciosPayload = exerciseRecords.map((ex, index) => {
      const completedSets = ex.sets.filter((s) => s.completed || s.weightKg || s.reps)
      const repsString = (completedSets.length > 0 ? completedSets : ex.sets)
        .map((s) => s.reps || '10')
        .join(', ')

      const maxWeight = Math.max(
        0,
        ...ex.sets.map((s) => parseFloat(s.weightKg) || 0),
      )

      return {
        exercicioId: ex.exerciseId,
        order: index + 1,
        setsCompleted: completedSets.length || ex.sets.length,
        repsCompleted: repsString,
        maxWeightKg: maxWeight,
      }
    })

    const payload: CreateWorkoutExecutionPayload = {
      treinoId: division.id,
      title: `${division.name} · ${planTitle}`,
      startedAt,
      completedAt,
      durationMinutes,
      notes: notes.trim() || undefined,
      exercicios: exerciciosPayload,
    }

    setIsSubmitting(true)
    try {
      await onFinish(payload)
      try {
        localStorage.removeItem(storageKey)
      } catch {
        // Ignore
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="active-workout-overlay" role="dialog" aria-modal="true">
      <div className="active-workout-container">
        <header className="active-workout-header">
          <div className="active-workout-header__info">
            <h2>{division.name}</h2>
            <p>{planTitle}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="active-workout-timer-badge">
              <Clock size={18} color="#e2a83e" />
              <span className="active-workout-timer-text">{formatTimer(elapsedSeconds)}</span>
              <button
                type="button"
                className="active-workout-timer-btn"
                onClick={togglePause}
                title={isPaused ? 'Retomar treino' : 'Pausar treino'}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
          </div>
        </header>

        <div className="active-workout-body">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#191a18',
              border: '1px solid #33322d',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.25rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2a83e', fontSize: '0.85rem', fontWeight: 700 }}>
              <Hourglass size={16} />
              <span>Tempo de Descanso entre Séries:</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {REST_PRESETS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedRestSeconds(sec)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.4rem',
                    border: selectedRestSeconds === sec ? '1px solid #e2a83e' : '1px solid #3d3b35',
                    background: selectedRestSeconds === sec ? '#2b2311' : '#141513',
                    color: selectedRestSeconds === sec ? '#f2c265' : '#aaa69d',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {exerciseRecords.map((exRecord, exIdx) => {
            const prescription = division.exercises[exIdx]
            const hasVideo = prescription?.hasVideo ?? Boolean(prescription?.media?.some((m) => m.kind === 'video'))

            return (
              <div key={exRecord.exerciseId} className="exercise-execution-card">
                <div className="exercise-execution-card__header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3>{exRecord.exerciseName}</h3>
                    {hasVideo && (
                      <button
                        type="button"
                        className="exercise-view-video-btn"
                        onClick={() => setSelectedExerciseForMedia(prescription || { exerciseId: exRecord.exerciseId, exerciseName: exRecord.exerciseName, muscleGroup: exRecord.muscleGroup, order: exIdx + 1, sets: 0, reps: '' })}
                        title={`Ver vídeo do exercício ${exRecord.exerciseName}`}
                      >
                        <Video size={13} />
                        <span>Vídeo</span>
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#aaa69d' }}>{exRecord.muscleGroup}</span>
                </div>

                {prescription && (
                  <div className="exercise-prescription-ref">
                    <span>Prescrito: <strong>{prescription.sets} séries</strong></span>
                    <span>Reps: <strong>{prescription.reps}</strong></span>
                    {prescription.targetLoad && <span>Carga alvo: <strong>{prescription.targetLoad}</strong></span>}
                    {prescription.restInterval && <span>Descanso: <strong>{prescription.restInterval}</strong></span>}
                  </div>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table className="sets-table">
                    <thead>
                      <tr>
                        <th>Série</th>
                        <th>Carga (kg)</th>
                        <th>Reps Feitas</th>
                        <th>Concluir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exRecord.sets.map((set, sIdx) => (
                        <tr key={sIdx}>
                          <td><strong>#{sIdx + 1}</strong></td>
                          <td>
                            <input
                              type="number"
                              placeholder="kg"
                              value={set.weightKg}
                              onChange={(e) => handleUpdateSet(exIdx, sIdx, 'weightKg', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="reps"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(exIdx, sIdx, 'reps', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`set-check-btn ${set.completed ? 'set-check-btn--done' : ''}`}
                              onClick={() => handleUpdateSet(exIdx, sIdx, 'completed', !set.completed)}
                              title={set.completed ? 'Série concluída' : 'Marcar como concluída'}
                            >
                              {set.completed ? <CheckCircle2 size={16} /> : <Check size={16} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#aaa69d' }}>
              Notas da sessão (opcional):
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Treino muito produtivo, senti evolução no supino..."
              rows={2}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#10110f',
                border: '1px solid #33322d',
                borderRadius: '0.5rem',
                color: '#f2efe8',
                padding: '0.75rem',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        <footer className="active-workout-footer">
          <button type="button" className="active-workout-cancel-btn" onClick={onClose} disabled={isSubmitting}>
            Pausar e Sair
          </button>
          <button type="button" className="active-workout-finish-btn" onClick={handleFinishWorkout} disabled={isSubmitting}>
            <Trophy size={18} />
            {isSubmitting ? 'A finalizar...' : 'Finalizar Treino'}
          </button>
        </footer>
      </div>

      {activeRestPopup && (
        <RestCountdownPopup
          initialSeconds={activeRestPopup.initialSeconds}
          exerciseName={activeRestPopup.exerciseName}
          completedSetNumber={activeRestPopup.completedSetNumber}
          nextInfo={activeRestPopup.nextInfo}
          onClose={() => setActiveRestPopup(null)}
        />
      )}

      {selectedExerciseForMedia && (
        <ExerciseMediaViewerModal
          exerciseId={selectedExerciseForMedia.exerciseId || selectedExerciseForMedia.exercicioId}
          exerciseName={selectedExerciseForMedia.exerciseName || 'Exercício'}
          initialMedia={selectedExerciseForMedia.media}
          onClose={() => setSelectedExerciseForMedia(null)}
        />
      )}
    </div>
  )
}
