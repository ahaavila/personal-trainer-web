import { useEffect, useMemo, useState } from 'react'
import { Dumbbell, Plus, Search, X } from 'lucide-react'
import { getExercises } from '../exercicios/api'
import type { ExerciseListItem } from '../exercicios/types'
import './ExercisePickerModal.css'

interface ExercisePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (exercise: ExerciseListItem) => void
  alreadySelectedIds?: number[]
}

export function ExercisePickerModal({
  isOpen,
  onClose,
  onSelect,
  alreadySelectedIds = [],
}: ExercisePickerModalProps) {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('todos')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    let isMounted = true

    getExercises()
      .then((data) => {
        if (isMounted) {
          setExercises(data)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar exercícios.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Extract unique muscle groups
  const muscleGroups = useMemo(() => {
    const set = new Set<string>()
    exercises.forEach((ex) => {
      if (ex.muscleGroup) set.add(ex.muscleGroup.trim())
    })
    return Array.from(set).sort()
  }, [exercises])

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(search.toLowerCase()) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(search.toLowerCase()))

      const matchesGroup =
        selectedGroup === 'todos' ||
        ex.muscleGroup.toLowerCase() === selectedGroup.toLowerCase()

      return matchesSearch && matchesGroup
    })
  }, [exercises, search, selectedGroup])

  if (!isOpen) return null

  return (
    <div className="exercise-picker-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="exercise-picker-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="exercise-picker-modal__header">
          <div>
            <span className="exercise-picker-modal__eyebrow">Biblioteca de Exercícios</span>
            <h2>Selecionar Exercício</h2>
          </div>
          <button
            type="button"
            className="exercise-picker-modal__close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="exercise-picker-modal__filters">
          <div className="exercise-picker-modal__search-wrap">
            <Search size={18} className="exercise-picker-modal__search-icon" />
            <input
              type="text"
              placeholder="Buscar exercício por nome, músculo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="exercise-picker-modal__search-input"
              autoFocus
            />
          </div>

          <div className="exercise-picker-modal__group-pills">
            <button
              type="button"
              className={`exercise-picker-modal__pill ${selectedGroup === 'todos' ? 'is-active' : ''}`}
              onClick={() => setSelectedGroup('todos')}
            >
              Todos
            </button>
            {muscleGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={`exercise-picker-modal__pill ${selectedGroup.toLowerCase() === group.toLowerCase() ? 'is-active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <div className="exercise-picker-modal__body">
          {loading && (
            <div className="exercise-picker-modal__loading">
              <p>Carregando exercícios...</p>
            </div>
          )}

          {error && (
            <div className="exercise-picker-modal__error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredExercises.length === 0 && (
            <div className="exercise-picker-modal__empty">
              <Dumbbell size={36} />
              <p>Nenhum exercício encontrado para os filtros selecionados.</p>
            </div>
          )}

          {!loading && !error && filteredExercises.length > 0 && (
            <div className="exercise-picker-modal__grid">
              {filteredExercises.map((exercise) => {
                const isSelected = exercise.id ? alreadySelectedIds.includes(exercise.id) : false

                return (
                  <div key={exercise.id} className="exercise-picker-card">
                    <div className="exercise-picker-card__info">
                      <div className="exercise-picker-card__tags">
                        <span className="exercise-picker-card__badge-group">
                          {exercise.muscleGroup}
                        </span>
                        <span className="exercise-picker-card__badge-level">
                          {exercise.level}
                        </span>
                      </div>
                      <h4 className="exercise-picker-card__title">{exercise.name}</h4>
                      {exercise.equipment && (
                        <p className="exercise-picker-card__equipment">
                          Equipamento: {exercise.equipment}
                        </p>
                      )}
                      <p className="exercise-picker-card__defaults">
                        Padrão: {exercise.defaultSets} séries · {exercise.defaultReps} reps
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`exercise-picker-card__add-btn ${isSelected ? 'is-already-added' : ''}`}
                      onClick={() => {
                        onSelect(exercise)
                        onClose()
                      }}
                    >
                      <Plus size={16} />
                      {isSelected ? 'Adicionar novamente' : 'Adicionar'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
