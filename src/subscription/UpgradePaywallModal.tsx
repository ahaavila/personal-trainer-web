import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, Sparkles, X, Zap } from 'lucide-react'
import { createCheckoutSession } from './api'
import './UpgradePaywallModal.css'

interface UpgradePaywallModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly currentActiveStudents?: number
}

export function UpgradePaywallModal({
  isOpen,
  onClose,
  currentActiveStudents = 5,
}: UpgradePaywallModalProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleDirectUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const { url } = await createCheckoutSession()
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar checkout do Stripe.')
      setLoading(false)
    }
  }

  function handleGoToPlans() {
    onClose()
    navigate('/planos')
  }

  return (
    <div className="paywall-overlay" role="presentation" onClick={onClose}>
      <div
        className="paywall-card"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="paywall-close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="paywall-icon-badge">
          <Sparkles size={24} color="var(--brand-primary, #e6b94e)" />
        </div>

        <h2>Limite do Plano Básico Atingido</h2>
        <p className="paywall-desc">
          Já tem <strong>{currentActiveStudents} alunos ativos</strong> cadastrados. No Plano Básico o limite é de 5 alunos ativos.
        </p>

        <div className="paywall-box">
          <div className="paywall-box__header">
            <span className="paywall-box__plan-title">Plano PRO</span>
            <span className="paywall-box__price">19,90€ / mês</span>
          </div>
          <ul className="paywall-features">
            <li>
              <Check size={16} color="var(--brand-primary, #e6b94e)" />
              <span><strong>Alunos Ilimitados</strong></span>
            </li>
            <li>
              <Check size={16} color="var(--brand-primary, #e6b94e)" />
              <span>Prescrição e fichas de treino completas</span>
            </li>
            <li>
              <Check size={16} color="var(--brand-primary, #e6b94e)" />
              <span>Faturação e pagamentos seguros com Stripe</span>
            </li>
            <li>
              <Check size={16} color="var(--brand-primary, #e6b94e)" />
              <span>Cancele quando quiser</span>
            </li>
          </ul>
        </div>

        {error && <div className="paywall-error">{error}</div>}

        <div className="paywall-actions">
          <button
            type="button"
            className="paywall-btn paywall-btn--primary"
            onClick={handleDirectUpgrade}
            disabled={loading}
          >
            <Zap size={16} />
            <span>{loading ? 'A abrir Stripe...' : 'Fazer Upgrade para PRO'}</span>
          </button>

          <button
            type="button"
            className="paywall-btn paywall-btn--secondary"
            onClick={handleGoToPlans}
            disabled={loading}
          >
            Ver detalhes dos planos
          </button>
        </div>
      </div>
    </div>
  )
}
