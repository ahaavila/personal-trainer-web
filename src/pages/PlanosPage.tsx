import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Check, CreditCard, ExternalLink, HelpCircle, Shield, Sparkles, Zap } from 'lucide-react'
import { createCheckoutSession, createPortalSession, getSubscriptionStatus } from '../subscription/api'
import type { SubscriptionStatusResponse } from '../subscription/types'
import './PlanosPage.css'

export default function PlanosPage() {
  const [searchParams] = useSearchParams()
  const isUpgraded = searchParams.get('upgraded') === 'true' || searchParams.has('session_id')
  const isCanceled = searchParams.get('canceled') === 'true'

  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getSubscriptionStatus()
      .then((data) => {
        if (!cancelled) {
          setStatus(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar a assinatura.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleUpgrade() {
    setActionLoading(true)
    setActionError(null)
    try {
      const { url } = await createCheckoutSession()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Falha ao iniciar o checkout do Stripe.')
      setActionLoading(false)
    }
  }

  async function handleManageSubscription() {
    setActionLoading(true)
    setActionError(null)
    try {
      const { url } = await createPortalSession()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Falha ao aceder ao portal do Stripe.')
      setActionLoading(false)
    }
  }

  const isPro = status?.plan === 'pro'

  return (
    <main className="planos-page">
      <header className="planos-page__header">
        <div>
          <h1>Planos & Assinatura</h1>
          <p>Escale os seus acompanhamentos fitness sem limites com o Plano PRO.</p>
        </div>
      </header>

      {isUpgraded && (
        <output className="planos-alert planos-alert--success">
          <Sparkles size={18} />
          <span>Parabéns! O seu plano foi atualizado para o <strong>Plano PRO</strong> com sucesso!</span>
        </output>
      )}

      {isCanceled && (
        <output className="planos-alert planos-alert--info">
          <HelpCircle size={18} />
          <span>O processo de checkout foi cancelado. Continua com o seu plano atual.</span>
        </output>
      )}

      {actionError && (
        <div className="planos-alert planos-alert--danger" role="alert">
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <p className="planos-state">A carregar informações da assinatura...</p>
      ) : error ? (
        <div className="planos-state">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Current Status Banner */}
          <div className="planos-status-card">
            <div className="planos-status-card__left">
              <span className={`planos-badge ${isPro ? 'planos-badge--pro' : 'planos-badge--basic'}`}>
                {isPro ? 'Plano PRO Ativo' : 'Plano Básico (Gratuito)'}
              </span>
              <h2>
                {isPro ? 'Alunos Ilimitados Desbloqueados' : `${status?.activeStudents ?? 0} de 5 alunos ativos utilizados`}
              </h2>
              <p>
                {isPro
                  ? 'Tem acesso ilimitado a todos os recursos da plataforma sem qualquer restrição de capacidade.'
                  : 'Pode gerir até 5 alunos ativos em simultâneo. Arquive alunos inativos para libertar vagas ou faça upgrade para o PRO.'}
              </p>
            </div>

            <div className="planos-status-card__right">
              {isPro ? (
                <button
                  type="button"
                  className="planos-btn planos-btn--outline"
                  onClick={handleManageSubscription}
                  disabled={actionLoading}
                >
                  <CreditCard size={16} />
                  <span>{actionLoading ? 'A abrir Stripe...' : 'Gerir Faturação no Stripe'}</span>
                  <ExternalLink size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  className="planos-btn planos-btn--primary"
                  onClick={handleUpgrade}
                  disabled={actionLoading}
                >
                  <Zap size={16} />
                  <span>{actionLoading ? 'A redirecionar...' : 'Fazer Upgrade para PRO'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Plan Comparison Grid */}
          <div className="planos-grid">
            {/* Basic Plan Card */}
            <div className={`planos-card ${!isPro ? 'planos-card--current' : ''}`}>
              {!isPro && <span className="planos-card__badge-current">Seu plano atual</span>}
              <div className="planos-card__header">
                <h3>Básico</h3>
                <p>Ideal para quem está a começar a sua consultoria.</p>
                <div className="planos-card__price">
                  <span className="price-amount">0€</span>
                  <span className="price-cycle">/mês</span>
                </div>
              </div>

              <ul className="planos-card__features">
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Até <strong>5 alunos ativos</strong></span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Prescrição e fichas de treino completas</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Biblioteca de exercícios e vídeos</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Acompanhamento de evolução e cargas</span>
                </li>
              </ul>

              <div className="planos-card__footer">
                <button
                  type="button"
                  className="planos-btn planos-btn--disabled"
                  disabled
                >
                  {!isPro ? 'Plano Atual' : 'Plano Gratuito'}
                </button>
              </div>
            </div>

            {/* PRO Plan Card */}
            <div className={`planos-card planos-card--highlight ${isPro ? 'planos-card--current' : ''}`}>
              <div className="planos-card__badge-promo">
                <Sparkles size={13} />
                <span>Mais Popular</span>
              </div>
              <div className="planos-card__header">
                <h3>PRO</h3>
                <p>Para personal trainers que querem escalar o seu negócio sem limites.</p>
                <div className="planos-card__price">
                  <span className="price-amount">19,90€</span>
                  <span className="price-cycle">/mês</span>
                </div>
              </div>

              <ul className="planos-card__features">
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span><strong>Alunos Ilimitados</strong></span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Prescrição e fichas de treino ilimitadas</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Upload e reprodução de vídeos em Cloudflare R2</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Histórico completo de evolução de cargas</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Gestão segura de pagamentos com Stripe</span>
                </li>
                <li>
                  <Check size={16} color="var(--brand-primary, #e6b94e)" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>

              <div className="planos-card__footer">
                {isPro ? (
                  <button
                    type="button"
                    className="planos-btn planos-btn--outline"
                    onClick={handleManageSubscription}
                    disabled={actionLoading}
                  >
                    <span>{actionLoading ? 'A abrir Stripe...' : 'Gerir Assinatura'}</span>
                    <ExternalLink size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="planos-btn planos-btn--primary"
                    onClick={handleUpgrade}
                    disabled={actionLoading}
                  >
                    <Zap size={16} />
                    <span>{actionLoading ? 'A redirecionar...' : 'Assinar Plano PRO'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="planos-guarantee">
            <Shield size={18} color="var(--brand-primary, #e6b94e)" />
            <span>Pagamento seguro via <strong>Stripe</strong>. Cancele quando quiser diretamente no portal do cliente.</span>
          </div>
        </>
      )}
    </main>
  )
}
