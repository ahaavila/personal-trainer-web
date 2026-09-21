import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sparkles, UserPlus, Zap } from 'lucide-react'
import { createAluno } from '../alunos/api'
import type { CreateAlunoInput } from '../alunos/types'
import { getSubscriptionStatus } from '../subscription/api'
import type { SubscriptionStatusResponse } from '../subscription/types'
import { UpgradePaywallModal } from '../subscription/UpgradePaywallModal'
import './NovoAlunoPage.css'

type FormValues = CreateAlunoInput
type FieldName = keyof FormValues

const INITIAL_FORM: FormValues = {
  name: '',
  email: '',
  objective: 'hipertrofia',
  level: 'iniciante',
}

function NovoAlunoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null)
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSubscriptionStatus()
      .then((data) => {
        if (!cancelled) setSubscription(data)
      })
      .catch(() => {
        // Ignore failure
      })
    return () => {
      cancelled = true
    }
  }, [])

  const isBasicPlan = subscription ? subscription.plan === 'basic' : true
  const isQuotaReached = isBasicPlan && (subscription ? subscription.activeStudents >= 5 : false)

  function updateField(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Informe o nome completo do aluno.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'Informe um e-mail válido.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    if (isQuotaReached) {
      setIsPaywallOpen(true)
      return
    }

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createAluno({
        name: form.name.trim(),
        email: form.email.trim(),
        objective: form.objective,
        level: form.level,
      })
      navigate('/alunos', { state: { createdAluno: form.name.trim() } })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Não foi possível criar o aluno.'
      setServerError(msg)
      if (msg.toLowerCase().includes('limite')) {
        setIsPaywallOpen(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="novo-aluno-page">
      <header className="novo-aluno-page__header">
        <div>
          <span>Novo aluno</span>
          <h1>Criar conta de aluno</h1>
          <p>Defina os dados iniciais para vincular o aluno ao seu acompanhamento.</p>
        </div>
        <Link to="/alunos">Voltar para alunos</Link>
      </header>

      {isQuotaReached && (
        <div className="novo-aluno-quota-warning" role="alert">
          <div className="novo-aluno-quota-warning__text">
            <Sparkles size={18} color="#e6b94e" />
            <span>
              <strong>Limite de alunos atingido:</strong> Já tem 5 alunos ativos no Plano Básico.
            </span>
          </div>
          <button
            type="button"
            className="novo-aluno-quota-warning__btn"
            onClick={() => setIsPaywallOpen(true)}
          >
            <Zap size={14} /> Fazer Upgrade para PRO
          </button>
        </div>
      )}

      <form className="novo-aluno-form" onSubmit={handleSubmit} noValidate>
        <section>
          <h2>Dados de acesso</h2>
          <p>O aluno receberá um convite por e-mail para definir a sua senha de acesso.</p>
          <div className="novo-aluno-form__grid">
            <Field label="Nome completo" error={errors.name}>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                autoComplete="name"
                placeholder="Ex: João Silva"
              />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                autoComplete="email"
                placeholder="aluno@email.com"
              />
            </Field>
          </div>
        </section>
        <section>
          <h2>Perfil de treino</h2>
          <p>Essas informações aparecem na sua lista de alunos.</p>
          <div className="novo-aluno-form__grid">
            <Field label="Objetivo">
              <select
                value={form.objective}
                onChange={(event) => updateField('objective', event.target.value)}
              >
                <option value="hipertrofia">Hipertrofia</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="condicionamento">Condicionamento</option>
              </select>
            </Field>
            <Field label="Nível">
              <select
                value={form.level}
                onChange={(event) => updateField('level', event.target.value)}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </Field>
          </div>
        </section>
        {serverError && <p className="novo-aluno-form__server-error" role="alert">{serverError}</p>}
        <footer>
          <Link to="/alunos">Cancelar</Link>
          <button type="submit" disabled={isSubmitting}>
            <UserPlus size={18} /> {isSubmitting ? 'A criar...' : 'Criar aluno'}
          </button>
        </footer>
      </form>

      <UpgradePaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        currentActiveStudents={subscription?.activeStudents ?? 5}
      />
    </main>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="novo-aluno-form__field">
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  )
}

export default NovoAlunoPage

