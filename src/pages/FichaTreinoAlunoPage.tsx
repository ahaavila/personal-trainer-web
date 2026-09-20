import { useEffect, useState } from 'react'
import { AlertCircle, Bell, Calendar, Check, ChevronRight, ClipboardList, Dumbbell, Play, X } from 'lucide-react'
import { getTrainingPlans, requestPlanActivation } from '../fichas/api'
import type { TrainingPlan, TrainingPlanDivision } from '../fichas/types'
import { ActiveWorkoutModal } from '../fichas/ActiveWorkoutModal'
import { WorkoutCelebrationModal } from '../fichas/WorkoutCelebrationModal'
import { logWorkoutExecution } from '../progresso/api'
import type { CreateWorkoutExecutionPayload } from '../progresso/types'
import { useAuth } from '../auth/useAuth'
import './FichaTreinoAlunoPage.css'

function formatSingleDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

function formatDateRange(startDate?: string | null, endDate?: string | null) {
  if (!startDate && !endDate) return 'Sem datas definidas'
  if (startDate && !endDate) return `A partir de ${formatSingleDate(startDate)}`
  if (!startDate && endDate) return `Até ${formatSingleDate(endDate)}`
  return `${formatSingleDate(startDate)} a ${formatSingleDate(endDate)}`
}

const ACTIVATION_REQUESTED_KEY_PREFIX = 'fitforge:workout_requested:'

export default function FichaTreinoAlunoPage() {
  const { user } = useAuth()
  const userKey = user?.name ? user.name.toLowerCase().replace(/\s+/g, '.') : 'aluno'
  const storageKey = `${ACTIVATION_REQUESTED_KEY_PREFIX}${userKey}`

  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Notification state
  const [requestingActivation, setRequestingActivation] = useState(false)
  const [activationMessage, setActivationMessage] = useState<string | null>(() => {
    try {
      return localStorage.getItem(storageKey)
    } catch {
      return null
    }
  })
  const [activationError, setActivationError] = useState<string | null>(null)

  // Inspection modal
  const [inspectingPlan, setInspectingPlan] = useState<TrainingPlan | null>(null)

  // Active workout execution modal
  const [activeDivision, setActiveDivision] = useState<{
    division: TrainingPlanDivision
    planTitle: string
  } | null>(null)

  // Completed workout celebration modal
  const [finishedPayload, setFinishedPayload] = useState<CreateWorkoutExecutionPayload | null>(null)

  useEffect(() => {
    let cancelled = false
    getTrainingPlans()
      .then((data) => {
        if (!cancelled) {
          setPlans(data)
          // If the student now has an active plan created, clear any previous request state
          if (data.some((p) => p.status === 'active')) {
            try {
              localStorage.removeItem(storageKey)
            } catch {
              // Ignore
            }
            setActivationMessage(null)
          }
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar os treinos.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [storageKey])

  const handleRequestActivation = async () => {
    setRequestingActivation(true)
    setActivationError(null)
    try {
      const res = await requestPlanActivation()
      const msg = res.message || 'Solicitação enviada ao seu personal trainer com sucesso!'
      setActivationMessage(msg)
      try {
        localStorage.setItem(storageKey, msg)
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      setActivationError(err instanceof Error ? err.message : 'Não foi possível enviar a solicitação.')
    } finally {
      setRequestingActivation(false)
    }
  }

  const handleStartWorkout = (division: TrainingPlanDivision, planTitle: string) => {
    setActiveDivision({ division, planTitle })
    setInspectingPlan(null)
  }

  const handleFinishWorkoutExecution = async (payload: CreateWorkoutExecutionPayload) => {
    await logWorkoutExecution(payload)
    setActiveDivision(null)
    setFinishedPayload(payload)
  }

  if (loading) {
    return (
      <main className="ficha-aluno-page">
        <div style={{ padding: '4rem', textAlign: 'center', color: '#aaa69d' }}>
          A carregar fichas de treino...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="ficha-aluno-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef9e8d' }}>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  const hasActivePlan = plans.some((p) => p.status === 'active')

  return (
    <main className="ficha-aluno-page">
      <header className="ficha-aluno-header">
        <h1>Minha Ficha de Treino</h1>
        <p>Acesse as rotinas de treino preparadas pelo seu personal trainer e registre os seus treinos.</p>
      </header>

      {/* Banner de alerta caso o aluno não tenha nenhuma ficha de treino ativa */}
      {!hasActivePlan && (
        <section className="no-active-plan-banner">
          <div className="no-active-plan-banner__content">
            <div className="no-active-plan-banner__icon">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3>Sem ficha de treino ativa</h3>
              <p>
                Você não possui nenhum plano de treino ativo no momento. Notifique o seu personal trainer para que ele prepare uma nova rotina para você.
              </p>
              {activationMessage && (
                <p className="no-active-plan-banner__success">
                  <Check size={16} />
                  {activationMessage}
                </p>
              )}
              {activationError && (
                <p className="no-active-plan-banner__error">
                  {activationError}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="no-active-plan-banner__btn"
            onClick={handleRequestActivation}
            disabled={requestingActivation || Boolean(activationMessage)}
          >
            <Bell size={16} />
            {requestingActivation
              ? 'A enviar...'
              : activationMessage
              ? 'Personal Notificado ✓'
              : 'Solicitar novo treino ao meu Personal'}
          </button>
        </section>
      )}

      {plans.length === 0 ? (
        <section
          style={{
            background: 'linear-gradient(145deg, #181917, #131412)',
            border: '1px dashed #3a3832',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: '#24221a',
              color: '#e2a83e',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ClipboardList size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Nenhum plano atribuído</h2>
          <p style={{ margin: 0, color: '#aaa69d', maxWidth: '30rem' }}>
            O seu personal trainer ainda não disponibilizou uma ficha de treino ativa para a sua conta.
            Assim que uma ficha for criada, você poderá visualizá-la aqui.
          </p>
        </section>
      ) : (
        <div className="ficha-aluno-grid">
          {plans.map((plan) => {
            const isActive = plan.status === 'active'
            return (
              <article key={plan.id} className="ficha-aluno-card">
                <div>
                  <div className="ficha-aluno-card__top">
                    <div>
                      <h2>{plan.title}</h2>
                      <div className="ficha-aluno-card__dates">
                        <Calendar size={14} />
                        <span>{formatDateRange(plan.startDate, plan.endDate)}</span>
                      </div>
                    </div>
                    <span className={`ficha-aluno-badge ${isActive ? 'ficha-aluno-badge--active' : 'ficha-aluno-badge--archived'}`}>
                      {isActive ? 'Ativo' : 'Arquivado'}
                    </span>
                  </div>

                  {plan.notes && <p className="ficha-aluno-card__notes">{plan.notes}</p>}
                </div>

                <div>
                  <div className="ficha-aluno-card__meta" style={{ marginBottom: '1rem' }}>
                    <span><strong>{plan.divisionsCount || plan.divisions?.length || 0}</strong> divisões</span>
                    <span>·</span>
                    <span><strong>{plan.exercisesCount || 0}</strong> exercícios</span>
                  </div>

                  <button
                    type="button"
                    className="ficha-aluno-card__btn"
                    onClick={() => setInspectingPlan(plan)}
                  >
                    <span>Abrir Ficha de Treino</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Plan Inspection Modal */}
      {inspectingPlan && (() => {
        const isPlanActive = inspectingPlan.status === 'active'

        return (
          <div className="plan-inspection-modal" role="dialog" aria-modal="true">
            <div className="plan-inspection-container">
              <header className="plan-inspection-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h2>{inspectingPlan.title}</h2>
                    <span className={`ficha-aluno-badge ${isPlanActive ? 'ficha-aluno-badge--active' : 'ficha-aluno-badge--archived'}`}>
                      {isPlanActive ? 'Ativo' : 'Arquivado'}
                    </span>
                  </div>
                  <p>{inspectingPlan.notes || 'Rotinas de treino prescritas'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingPlan(null)}
                  style={{ background: 'transparent', border: 'none', color: '#aaa69d', cursor: 'pointer' }}
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="plan-inspection-body">
                {!isPlanActive && (
                  <div className="plan-inactive-notice">
                    <AlertCircle size={18} />
                    <span>Esta ficha de treino está arquivada/inativa. Não é possível iniciar novas sessões de treino para este plano.</span>
                  </div>
                )}

                {(!inspectingPlan.divisions || inspectingPlan.divisions.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa69d' }}>
                    Esta ficha ainda não contém divisões de treino cadastradas.
                  </div>
                ) : (
                  inspectingPlan.divisions.map((div) => (
                    <div key={div.id} className="division-card">
                      <header className="division-card__header">
                        <div>
                          <h3>{div.name}</h3>
                          {div.notes && <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#aaa69d' }}>{div.notes}</p>}
                        </div>
                        <button
                          type="button"
                          className={`division-start-btn ${!isPlanActive ? 'division-start-btn--disabled' : ''}`}
                          onClick={() => isPlanActive && handleStartWorkout(div, inspectingPlan.title)}
                          disabled={!isPlanActive}
                          title={isPlanActive ? 'Iniciar Treino' : 'Ficha inativa/arquivada - Início desabilitado'}
                        >
                          <Play size={14} fill={isPlanActive ? '#211909' : '#6b665c'} />
                          {isPlanActive ? 'Iniciar Treino' : 'Ficha Inativa'}
                        </button>
                      </header>

                      <table className="division-exercises-table">
                        <thead>
                          <tr>
                            <th>Exercício</th>
                            <th>Grupo</th>
                            <th>Séries</th>
                            <th>Reps</th>
                            <th>Carga Alvo</th>
                            <th>Descanso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {div.exercises.map((ex) => (
                            <tr key={ex.id}>
                              <td>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <Dumbbell size={14} color="#e2a83e" />
                                  <strong>{ex.exerciseName}</strong>
                                </span>
                              </td>
                              <td>{ex.muscleGroup}</td>
                              <td>{ex.sets}</td>
                              <td>{ex.reps}</td>
                              <td>{ex.targetLoad || '-'}</td>
                              <td>{ex.restInterval || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                )}
              </div>

              <footer className="plan-inspection-footer">
                <button
                  type="button"
                  className="plan-inspection-close-btn"
                  onClick={() => setInspectingPlan(null)}
                >
                  Fechar
                </button>
              </footer>
            </div>
          </div>
        )
      })()}

      {/* Active Workout Execution Modal */}
      {activeDivision && (
        <ActiveWorkoutModal
          division={activeDivision.division}
          planTitle={activeDivision.planTitle}
          studentEmail={user?.name ? user.name.toLowerCase().replace(/\s+/g, '.') : 'aluno'}
          onClose={() => setActiveDivision(null)}
          onFinish={handleFinishWorkoutExecution}
        />
      )}

      {/* Finished Workout Celebration Modal */}
      {finishedPayload && (
        <WorkoutCelebrationModal
          payload={finishedPayload}
          onClose={() => setFinishedPayload(null)}
        />
      )}
    </main>
  )
}
