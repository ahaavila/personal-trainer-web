import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Calendar, Dumbbell, History, LineChart, TrendingUp } from 'lucide-react'
import { getAlunos } from '../alunos/api'
import type { AlunoListItem } from '../alunos/types'
import { getStudentProgress } from '../progresso/api'
import type { StudentProgressData } from '../progresso/types'
import { LoadProgressionChart } from '../progresso/LoadProgressionChart'
import './EvolucaoPage.css'

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    return new Intl.DateTimeFormat('pt-PT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return isoDate
  }
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export default function EvolucaoPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedAlunoId = searchParams.get('alunoId') || ''

  const [alunos, setAlunos] = useState<AlunoListItem[]>([])
  const [progressData, setProgressData] = useState<StudentProgressData | null>(null)
  const [loadingAlunos, setLoadingAlunos] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'timeline' | 'evolution'>('timeline')
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string>('')

  // Load available students list
  useEffect(() => {
    let cancelled = false
    getAlunos()
      .then((data) => {
        if (!cancelled) {
          setAlunos(data)
          setLoadingAlunos(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadingAlunos(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Load student progress data when selectedAlunoId changes
  useEffect(() => {
    let cancelled = false

    if (!selectedAlunoId) {
      return
    }

    getStudentProgress(Number(selectedAlunoId))
      .then((data) => {
        if (!cancelled) {
          setProgressData(data)
          setLoadingProgress(false)

          // Set default exercise in evolution tab
          const keys = Object.keys(data.exerciseProgress)
          if (keys.length > 0) {
            setSelectedExerciseKey(keys[0])
          } else {
            setSelectedExerciseKey('')
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar a evolução do aluno.')
          setLoadingProgress(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedAlunoId])

  function handleSelectAluno(idStr: string) {
    if (idStr) {
      setSearchParams({ alunoId: idStr })
      setLoadingProgress(true)
      setError(null)
    } else {
      setSearchParams({})
      setProgressData(null)
    }
  }

  const effectiveProgressData = selectedAlunoId ? progressData : null
  const exerciseOptions = effectiveProgressData ? Object.entries(effectiveProgressData.exerciseProgress) : []
  const activeExerciseSummary = effectiveProgressData && selectedExerciseKey
    ? effectiveProgressData.exerciseProgress[selectedExerciseKey]
    : null

  return (
    <main className="evolucao-page">
      <header className="evolucao-header">
        <div>
          <h1>Evolução dos Alunos</h1>
          <p>Acompanhe o histórico de sessões, cargas progressivas e repetições.</p>
        </div>

        <div className="evolucao-selector-box">
          <label htmlFor="aluno-select">Aluno:</label>
          <select
            id="aluno-select"
            value={selectedAlunoId}
            onChange={(e) => handleSelectAluno(e.target.value)}
            disabled={loadingAlunos}
          >
            <option value="">-- Selecione um aluno --</option>
            {alunos.map((a) => (
              <option key={a.email} value={a.id || 1}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </div>
      </header>

      {!selectedAlunoId ? (
        <section className="evolucao-empty-prompt">
          <div className="evolucao-empty-prompt__icon">
            <TrendingUp size={28} />
          </div>
          <h2>Selecione um aluno acima</h2>
          <p>
            Escolha um dos seus alunos no seletor para visualizar o histórico de treinos concluídos,
            sobrecarga progressiva e gráficos de evolução por exercício.
          </p>
        </section>
      ) : loadingProgress ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa69d' }}>
          A carregar dados de evolução...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ef9e8d' }}>
          <p>{error}</p>
        </div>
      ) : effectiveProgressData ? (
        <div>
          {/* Aluno Summary Header Card */}
          <section className="aluno-summary-card">
            <div className="aluno-summary-card__profile">
              <span className="aluno-summary-card__avatar">{initials(effectiveProgressData.aluno.name)}</span>
              <div className="aluno-summary-card__details">
                <strong>{effectiveProgressData.aluno.name}</strong>
                <small>{effectiveProgressData.aluno.email}</small>
              </div>
            </div>

            <div className="aluno-summary-card__tags">
              <span className="aluno-summary-card__tag">
                Objetivo: <strong>{effectiveProgressData.aluno.objective}</strong>
              </span>
              <span className="aluno-summary-card__tag">
                Nível: <strong>{effectiveProgressData.aluno.level}</strong>
              </span>
              <span className="aluno-summary-card__tag">
                Treinos registados: <strong>{effectiveProgressData.aluno.totalWorkouts}</strong>
              </span>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="evolucao-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'timeline'}
              className={`evolucao-tab-btn ${activeTab === 'timeline' ? 'evolucao-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <History size={18} />
              Histórico de Treinos
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'evolution'}
              className={`evolucao-tab-btn ${activeTab === 'evolution' ? 'evolucao-tab-btn--active' : ''}`}
              onClick={() => setActiveTab('evolution')}
            >
              <LineChart size={18} />
              Evolução por Exercício
            </button>
          </div>

          {/* Tab 1: Timeline de Sessões de Treino */}
          {activeTab === 'timeline' && (
            <section aria-label="Histórico de Treinos">
              {effectiveProgressData.workoutLogs.length === 0 ? (
                <div className="evolucao-empty-prompt">
                  <Dumbbell size={28} />
                  <h2>Nenhum treino registado</h2>
                  <p>Este aluno ainda não concluiu sessões de treino registadas no sistema.</p>
                </div>
              ) : (
                <div className="timeline-list">
                  {effectiveProgressData.workoutLogs.map((log) => (
                    <article key={log.id} className="timeline-card">
                      <header className="timeline-card__header">
                        <div className="timeline-card__title">
                          <Dumbbell size={20} color="#e2a83e" />
                          <span>{log.title}</span>
                        </div>
                        <div className="timeline-card__meta">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={15} />
                            {formatDate(log.completedAt)}
                          </span>
                          <span>Duração: <strong>{log.durationMinutes ?? (log as unknown as { durationMin?: number }).durationMin ?? 0} min</strong></span>
                        </div>
                      </header>

                      {log.notes && <p className="timeline-card__notes">"{log.notes}"</p>}

                      <div style={{ overflowX: 'auto' }}>
                        <table className="timeline-exercises-table">
                          <thead>
                            <tr>
                              <th>Exercício</th>
                              <th>Grupo Muscular</th>
                              <th>Séries & Repetições</th>
                              <th>Carga Máx</th>
                              <th>Notas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {log.exercises.map((ex) => (
                              <tr key={ex.id}>
                                <td><strong>{ex.exerciseName || (ex as unknown as { exercicioName?: string }).exercicioName}</strong></td>
                                <td>{ex.muscleGroup}</td>
                                <td>{ex.setsCompleted} séries ({ex.repsCompleted})</td>
                                <td>
                                  <span className="timeline-load-badge">{ex.maxWeightKg} kg</span>
                                </td>
                                <td>{ex.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Tab 2: Evolução por Exercício */}
          {activeTab === 'evolution' && (
            <section aria-label="Evolução por Exercício" className="exercise-evolution-panel">
              {exerciseOptions.length === 0 ? (
                <div className="evolucao-empty-prompt">
                  <LineChart size={28} />
                  <h2>Sem dados de exercícios</h2>
                  <p>O aluno ainda não tem execuções de exercícios computadas para análise de sobrecarga.</p>
                </div>
              ) : (
                <>
                  <div className="exercise-evolution-controls">
                    <label htmlFor="exercise-select">Exercício:</label>
                    <select
                      id="exercise-select"
                      value={selectedExerciseKey}
                      onChange={(e) => setSelectedExerciseKey(e.target.value)}
                    >
                      {exerciseOptions.map(([key, item]) => {
                        const name = item.exerciseName || (item as unknown as { exercicioName?: string }).exercicioName
                        return (
                          <option key={key} value={key}>
                            {name} ({item.muscleGroup})
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  {activeExerciseSummary && (
                    <>
                      {/* Metric Cards Grid */}
                      <div className="metric-cards-grid">
                        <div className="metric-card">
                          <span className="metric-card__label">Carga Máx Atual</span>
                          <span className="metric-card__value">{activeExerciseSummary.currentMaxLoad ?? activeExerciseSummary.points?.[activeExerciseSummary.points.length - 1]?.maxWeightKg ?? 0} kg</span>
                          <span className="metric-card__delta metric-card__delta--positive">
                            +{activeExerciseSummary.totalGainKg ?? 0} kg vs início
                          </span>
                        </div>

                        <div className="metric-card">
                          <span className="metric-card__label">Carga Inicial</span>
                          <span className="metric-card__value">{activeExerciseSummary.startLoad ?? activeExerciseSummary.points?.[0]?.maxWeightKg ?? 0} kg</span>
                          <span className="metric-card__delta metric-card__delta--neutral">
                            Primeira sessão registada
                          </span>
                        </div>

                        <div className="metric-card">
                          <span className="metric-card__label">Evolução Relativa</span>
                          <span className="metric-card__value">+{activeExerciseSummary.percentageGain ?? 0}%</span>
                          <span className="metric-card__delta metric-card__delta--positive">
                            Sobrecarga progressiva
                          </span>
                        </div>

                        <div className="metric-card">
                          <span className="metric-card__label">Sessões Realizadas</span>
                          <span className="metric-card__value">{activeExerciseSummary.totalSessions ?? activeExerciseSummary.points?.length ?? 0}</span>
                          <span className="metric-card__delta metric-card__delta--neutral">
                            Total de registos
                          </span>
                        </div>
                      </div>

                      {/* SVG Line Progression Chart */}
                      <div className="chart-card">
                        <h3>Progressão de Carga ao Longo do Tempo</h3>
                        <LoadProgressionChart
                          points={activeExerciseSummary.points || (activeExerciseSummary as unknown as { dataPoints?: typeof activeExerciseSummary.points }).dataPoints || []}
                          exerciseName={activeExerciseSummary.exerciseName || (activeExerciseSummary as unknown as { exercicioName?: string }).exercicioName || 'Exercício'}
                        />
                      </div>

                      {/* Comparative Historical Table */}
                      <div className="history-comparison-card">
                        <h3>Histórico Detalhado do Exercício</h3>
                        <div style={{ overflowX: 'auto' }}>
                          <table className="history-comparison-table">
                            <thead>
                              <tr>
                                <th>Data</th>
                                <th>Sessão</th>
                                <th>Séries & Repetições</th>
                                <th>Carga Máxima</th>
                                <th>Variação</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(activeExerciseSummary.points || (activeExerciseSummary as unknown as { dataPoints?: typeof activeExerciseSummary.points }).dataPoints || []).map((p, idx, arr) => {
                                const prevPoint = idx > 0 ? arr[idx - 1] : null
                                const diff = prevPoint ? p.maxWeightKg - prevPoint.maxWeightKg : 0

                                return (
                                  <tr key={idx}>
                                    <td><strong>{p.date}</strong></td>
                                    <td>{p.sessionTitle}</td>
                                    <td>{p.setsCompleted} séries ({p.repsCompleted})</td>
                                    <td><span className="timeline-load-badge">{p.maxWeightKg} kg</span></td>
                                    <td>
                                      {idx === 0 ? (
                                        <span className="delta-badge delta-badge--neutral">Início</span>
                                      ) : diff > 0 ? (
                                        <span className="delta-badge delta-badge--up">+{diff} kg</span>
                                      ) : diff === 0 ? (
                                        <span className="delta-badge delta-badge--neutral">= mantida</span>
                                      ) : (
                                        <span className="delta-badge delta-badge--neutral">{diff} kg</span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      ) : null}
    </main>
  )
}
