import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search, TrendingUp, UserCheck, UserMinus, UserPlus, Zap } from 'lucide-react'
import { getAlunos, updateAlunoStatus } from '../alunos/api'
import type { AlunoListItem, AlunoStatus } from '../alunos/types'
import { getSubscriptionStatus } from '../subscription/api'
import type { SubscriptionStatusResponse } from '../subscription/types'
import { UpgradePaywallModal } from '../subscription/UpgradePaywallModal'
import './AlunosPage.css'

const STATUS_LABELS: Record<AlunoStatus, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  'não informado': 'Não informado',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function latestWorkoutLabel(aluno: AlunoListItem) {
  if (!aluno.latestWorkout) return 'Sem treinos registados'
  return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(new Date(aluno.latestWorkout.completedAt))
}

function AlunosPage() {
  const navigate = useNavigate()
  const [alunos, setAlunos] = useState<AlunoListItem[]>([])
  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | AlunoStatus>('all')
  const [objective, setObjective] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusActionLoading, setStatusActionLoading] = useState<number | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false

    Promise.all([getAlunos(), getSubscriptionStatus().catch(() => null)])
      .then(([nextAlunos, subData]) => {
        if (!cancelled) {
          setAlunos(nextAlunos)
          setSubscription(subData)
          setError(null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Não foi possível carregar os seus alunos.')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [retry])

  const activeStudentsCount = alunos.filter((a) => a.status === 'ativo').length
  const isBasicPlan = subscription ? subscription.plan === 'basic' : true
  const isQuotaReached = isBasicPlan && activeStudentsCount >= 5

  function handleNovoAlunoClick(e: React.MouseEvent) {
    if (isQuotaReached) {
      e.preventDefault()
      setIsPaywallOpen(true)
    } else {
      navigate('/criar-utilizador')
    }
  }

  async function handleToggleStatus(aluno: AlunoListItem) {
    if (!aluno.id) return
    const newStatus: 'ativo' | 'inativo' = aluno.status === 'ativo' ? 'inativo' : 'ativo'

    // If reactivating and at capacity, prompt paywall
    if (newStatus === 'ativo' && isQuotaReached) {
      setIsPaywallOpen(true)
      return
    }

    setStatusActionLoading(aluno.id)
    setActionMessage(null)

    try {
      const updated = await updateAlunoStatus(aluno.id, newStatus)
      setAlunos((prev) => prev.map((a) => (a.id === aluno.id ? updated : a)))
      setActionMessage(
        newStatus === 'ativo'
          ? `Aluno ${aluno.name} ativado com sucesso.`
          : `Aluno ${aluno.name} arquivado como inativo (vaga libertada).`,
      )
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes('limite')) {
        setIsPaywallOpen(true)
      } else {
        setActionMessage(err instanceof Error ? err.message : 'Falha ao alterar estado do aluno.')
      }
    } finally {
      setStatusActionLoading(null)
    }
  }

  const objectives = [...new Set(alunos.map((aluno) => aluno.objective).filter((value) => value !== 'não informado'))]
  const filteredAlunos = alunos.filter((aluno) => {
    const needle = search.trim().toLocaleLowerCase()
    const matchesSearch = !needle || aluno.name.toLocaleLowerCase().includes(needle) || aluno.email.toLocaleLowerCase().includes(needle)
    return matchesSearch && (status === 'all' || aluno.status === status) && (objective === 'all' || aluno.objective === objective)
  })

  return (
    <main className="alunos-page">
      <header className="alunos-page__header">
        <div>
          <h1>Alunos</h1>
          <p>Acompanhe perfis, objetivos e progresso dos seus alunos.</p>
        </div>

        <div className="alunos-page__header-actions">
          {/* Quota Progress Pill */}
          <div className="alunos-quota-badge">
            <div className="alunos-quota-badge__info">
              <span className="alunos-quota-badge__label">
                {isBasicPlan ? 'Capacidade Plano Básico' : 'Plano PRO'}
              </span>
              <strong className="alunos-quota-badge__count">
                {isBasicPlan ? `${activeStudentsCount} / 5 alunos ativos` : `${activeStudentsCount} alunos ativos (Ilimitado)`}
              </strong>
            </div>

            {isBasicPlan && (
              <button
                type="button"
                className="alunos-quota-badge__upgrade-btn"
                onClick={() => setIsPaywallOpen(true)}
                title="Fazer Upgrade para Plano PRO"
              >
                <Zap size={13} />
                <span>Upgrade PRO</span>
              </button>
            )}
          </div>

          <button
            type="button"
            className="alunos-page__new"
            onClick={handleNovoAlunoClick}
          >
            <UserPlus size={18} /> Novo aluno
          </button>
        </div>
      </header>

      {actionMessage && (
        <output className="alunos-feedback-banner">
          <span>{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage(null)}>✕</button>
        </output>
      )}

      <section className="alunos-table-card">
        <div className="alunos-filters">
          <label className="alunos-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar por nome ou e-mail" /></label>
          <select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value as 'all' | AlunoStatus)}><option value="all">Todos os estados</option><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select>
          <select aria-label="Filtrar por objetivo" value={objective} onChange={(event) => setObjective(event.target.value)}><option value="all">Todos os objetivos</option>{objectives.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        </div>

        {loading ? (
          <p className="alunos-state">A carregar alunos...</p>
        ) : error ? (
          <div className="alunos-state">
            <p>{error}</p>
            <button type="button" onClick={() => { setLoading(true); setError(null); setRetry((value) => value + 1) }}>
              Tentar novamente
            </button>
          </div>
        ) : alunos.length === 0 ? (
          <p className="alunos-state">Ainda não tem alunos associados.</p>
        ) : filteredAlunos.length === 0 ? (
          <p className="alunos-state">Nenhum aluno corresponde aos filtros selecionados.</p>
        ) : (
          <div className="alunos-table-wrap">
            <table className="alunos-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Objetivo</th>
                  <th>Nível</th>
                  <th>Último treino</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlunos.map((aluno) => {
                  const isActive = aluno.status === 'ativo'
                  const isUpdating = statusActionLoading === aluno.id

                  return (
                    <tr key={aluno.email}>
                      <td data-label="Aluno">
                        <span className="alunos-avatar">{initials(aluno.name)}</span>
                        <span>
                          <strong>{aluno.name}</strong>
                          <small>{aluno.email}</small>
                        </span>
                      </td>
                      <td data-label="Objetivo">{aluno.objective}</td>
                      <td data-label="Nível">{aluno.level}</td>
                      <td data-label="Último treino">{latestWorkoutLabel(aluno)}</td>
                      <td data-label="Estado">
                        <span className={`alunos-status alunos-status--${aluno.status.replace(' ', '-')}`}>
                          {STATUS_LABELS[aluno.status]}
                        </span>
                      </td>
                      <td data-label="Ações">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Link
                            to={`/evolucao?alunoId=${aluno.id || 1}`}
                            className="alunos-action-btn"
                            title="Ver evolução"
                          >
                            <TrendingUp size={15} />
                            <span>Evolução</span>
                          </Link>

                          <button
                            type="button"
                            className={`alunos-status-toggle-btn ${isActive ? 'alunos-status-toggle-btn--active' : 'alunos-status-toggle-btn--inactive'}`}
                            onClick={() => handleToggleStatus(aluno)}
                            disabled={isUpdating}
                            title={isActive ? 'Arquivar / Desativar aluno para libertar vaga' : 'Ativar aluno'}
                          >
                            {isActive ? <UserMinus size={14} /> : <UserCheck size={14} />}
                            <span>{isUpdating ? '...' : isActive ? 'Desativar' : 'Ativar'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <UpgradePaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        currentActiveStudents={activeStudentsCount}
      />
    </main>
  )
}

export default AlunosPage
