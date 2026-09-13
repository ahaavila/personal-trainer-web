import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Calendar,
  Dumbbell,
  Eye,
  FilePlus2,
  Layers,
  Plus,
  RefreshCw,
  Search,
  User,
} from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { getTrainingPlans } from '../fichas/api'
import { FichaDetailsModal } from '../fichas/FichaDetailsModal'
import type { TrainingPlan } from '../fichas/types'
import './TreinosPage.css'

export default function TreinosPage() {
  const location = useLocation()
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null)
  const [retry, setRetry] = useState(0)
  const [successBanner, setSuccessBanner] = useState<string | null>(
    (location.state as { createdPlan?: string } | null)?.createdPlan
      ? `Ficha "${(location.state as { createdPlan: string }).createdPlan}" criada com sucesso!`
      : null,
  )

  useEffect(() => {
    let isMounted = true

    getTrainingPlans()
      .then((data) => {
        if (isMounted) {
          setPlans(data)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar as fichas de treino.')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [retry])

  const filteredPlans = plans.filter((plan) => {
    const studentName = plan.studentName || plan.studentEmail || ''
    const matchesSearch =
      plan.title.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase())

    const planStatus = plan.status || 'active'
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && planStatus === 'active') ||
      (statusFilter === 'archived' && planStatus === 'archived')

    return matchesSearch && matchesStatus
  })

  function handlePlanUpdated(updated: TrainingPlan) {
    setPlans((current) =>
      current.map((item) => (String(item.id) === String(updated.id) ? updated : item)),
    )
    setSelectedPlan(updated)
    setSuccessBanner(`Ficha "${updated.title}" atualizada com sucesso!`)
  }

  function handlePlanDeleted(deletedId: number | string) {
    setPlans((current) =>
      current.filter((item) => String(item.id) !== String(deletedId)),
    )
    setSelectedPlan(null)
    setSuccessBanner('Ficha de treino excluída com sucesso!')
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return null
    try {
      return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: 'short',
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  return (
    <main className="treinos-page">
      <header className="treinos-page__header">
        <div>
          <h1>Treinos</h1>
          <p>Consulte e acompanhe todas as fichas de treino criadas para os seus alunos.</p>
        </div>
        <Link className="treinos-page__new-btn" to="/nova-ficha-de-treino">
          <Plus size={18} /> Nova Ficha de Treino
        </Link>
      </header>

      {successBanner && (
        <div className="treinos-page__success-banner" role="status">
          <span>{successBanner}</span>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="treinos-page__success-close"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <section className="treinos-page__toolbar">
        <div className="treinos-page__search-wrap">
          <Search size={18} className="treinos-page__search-icon" />
          <input
            type="text"
            placeholder="Buscar por título da ficha ou nome do aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="treinos-page__search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived')}
          className="treinos-page__status-select"
          aria-label="Filtrar por status"
        >
          <option value="all">Todos os status</option>
          <option value="active">Apenas ativas</option>
          <option value="archived">Arquivadas</option>
        </select>
      </section>

      {/* Content Body */}
      <section className="treinos-page__content">
        {loading && (
          <div className="treinos-page__loading">
            <RefreshCw size={28} className="spin" />
            <p>Carregando fichas de treino...</p>
          </div>
        )}

        {error && (
          <div className="treinos-page__error" role="alert">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button
              type="button"
              className="treinos-page__retry-btn"
              onClick={() => {
                setLoading(true)
                setError(null)
                setRetry((c) => c + 1)
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="treinos-page__empty">
            <FilePlus2 size={44} />
            <h3>Nenhuma ficha de treino criada</h3>
            <p>Comece criando a primeira ficha de treino personalizada para os seus alunos.</p>
            <Link to="/nova-ficha-de-treino" className="treinos-page__empty-action">
              <Plus size={16} /> Criar Nova Ficha
            </Link>
          </div>
        )}

        {!loading && !error && plans.length > 0 && filteredPlans.length === 0 && (
          <div className="treinos-page__no-results">
            <Search size={36} />
            <p>Nenhuma ficha encontrada para os filtros aplicados.</p>
          </div>
        )}

        {!loading && !error && filteredPlans.length > 0 && (
          <div className="treinos-page__grid">
            {filteredPlans.map((plan) => {
              const studentDisplayName = plan.studentName || plan.studentEmail || 'Aluno'
              const divisionsCount = plan.divisions?.length || plan.divisionsCount || 0
              const exercisesCount =
                plan.exercisesCount ??
                plan.divisions?.reduce((acc, d) => acc + (d.exercises?.length || 0), 0) ??
                0
              const isArchived = plan.status === 'archived'

              return (
                <article key={plan.id} className="treino-card">
                  <header className="treino-card__header">
                    <div className="treino-card__title-wrap">
                      <span
                        className={`treino-card__status-badge ${isArchived ? 'is-archived' : 'is-active'}`}
                      >
                        {isArchived ? 'Arquivado' : 'Ativo'}
                      </span>
                      <h2 className="treino-card__title">{plan.title}</h2>
                    </div>
                  </header>

                  <div className="treino-card__student">
                    <div className="treino-card__avatar">
                      <User size={16} />
                    </div>
                    <div className="treino-card__student-info">
                      <span className="treino-card__student-name">{studentDisplayName}</span>
                      {plan.studentEmail && plan.studentName && (
                        <span className="treino-card__student-email">{plan.studentEmail}</span>
                      )}
                    </div>
                    {plan.studentObjective && (
                      <span className="treino-card__objective-badge">
                        {plan.studentObjective}
                      </span>
                    )}
                  </div>

                  {plan.notes && (
                    <p className="treino-card__notes">{plan.notes}</p>
                  )}

                  <div className="treino-card__metrics">
                    <span className="treino-card__chip">
                      <Layers size={14} /> {divisionsCount} {divisionsCount === 1 ? 'divisão' : 'divisões'}
                    </span>
                    <span className="treino-card__chip">
                      <Dumbbell size={14} /> {exercisesCount} {exercisesCount === 1 ? 'exercício' : 'exercícios'}
                    </span>
                  </div>

                  {(plan.startDate || plan.endDate) && (
                    <div className="treino-card__dates">
                      <Calendar size={13} />
                      <span>
                        {formatDate(plan.startDate) || 'Início'} — {formatDate(plan.endDate) || 'Indeterminado'}
                      </span>
                    </div>
                  )}

                  <footer className="treino-card__footer">
                    <button
                      type="button"
                      className="treino-card__view-btn"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <Eye size={15} /> Ver detalhes da ficha
                    </button>
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Details Inspection, Edit & Delete Modal */}
      <FichaDetailsModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onUpdated={handlePlanUpdated}
        onDeleted={handlePlanDeleted}
      />
    </main>
  )
}
