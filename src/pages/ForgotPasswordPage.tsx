import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { requestPasswordReset } from '../auth/api'
import type { ForgotPasswordResponse } from '../auth/types'
import './LoginPage.css'
import './ForgotPasswordPage.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successResponse, setSuccessResponse] = useState<ForgotPasswordResponse | null>(null)

  const emailId = useId()

  const validate = () => {
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('O e-mail é obrigatório.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setEmailError('Formato de e-mail inválido.')
      return false
    }

    setEmailError('')
    return true
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await requestPasswordReset({ email: email.trim() })
      setSuccessResponse(response)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro ao processar o pedido.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page forgot-password-page">
      <section className="login-hero" aria-label="Painel decorativo">
        <div className="login-hero__arc" aria-hidden="true" />
        <p className="login-hero__tagline">Evolução · Consistência · Resultados</p>
      </section>

      <section className="login-panel forgot-password-panel" aria-label="Painel de recuperação de senha">
        <div className="login-panel__brand">
          <span className="login-panel__logo" aria-hidden="true" />
          <span className="login-panel__brand-name">FITFORGE</span>
        </div>
        <div className="login-panel__divider" aria-hidden="true" />

        <h1 className="login-panel__title">Recuperar senha</h1>
        <p className="login-panel__subtitle">
          Introduza o seu e-mail para receber as instruções de recuperação de senha.
        </p>

        {successResponse ? (
          <div className="forgot-password-feedback">
            <p className="forgot-password-feedback__message">{successResponse.message}</p>
            {successResponse.simulatedUrl && (
              <div className="forgot-password-feedback__dev-box">
                <p className="forgot-password-feedback__dev-title">Link de teste (Ambiente de desenvolvimento)</p>
                <Link to={successResponse.simulatedUrl} className="forgot-password-feedback__dev-link">
                  Clique aqui para redefinir a sua senha
                </Link>
              </div>
            )}
            <div style={{ marginTop: '0.5rem' }}>
              <Link to="/login" className="forgot-password-panel__back-link">
                &larr; Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <form className="login-form forgot-password-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__field">
              <label htmlFor={emailId}>E-mail</label>
              <input
                id={emailId}
                type="email"
                placeholder="Digite seu e-mail cadastrado"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (emailError) setEmailError('')
                }}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? `${emailId}-error` : undefined}
                disabled={isSubmitting}
              />
              {emailError && (
                <p className="login-form__error" id={`${emailId}-error`}>
                  {emailError}
                </p>
              )}
            </div>

            {formError && <p className="login-form__error login-form__error--form">{formError}</p>}

            <button type="submit" className="login-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'A enviar...' : 'Enviar instruções'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <Link to="/login" className="forgot-password-panel__back-link">
                &larr; Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
