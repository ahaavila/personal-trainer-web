import { useId, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { resetPassword } from '../auth/api'
import './LoginPage.css'
import './ResetPasswordPage.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordId = useId()
  const confirmPasswordId = useId()

  const validate = () => {
    let valid = true
    setPasswordError('')
    setConfirmPasswordError('')

    if (!password) {
      setPasswordError('A nova senha é obrigatória.')
      valid = false
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.')
      valid = false
    }

    if (!confirmPassword) {
      setConfirmPasswordError('A confirmação de senha é obrigatória.')
      valid = false
    } else if (password && confirmPassword !== password) {
      setConfirmPasswordError('As senhas não coincidem.')
      valid = false
    }

    return valid
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError('')

    if (!token) {
      setFormError('Token de recuperação em falta.')
      return
    }

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({ token, password })
      setIsSuccess(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erro ao redefinir a senha.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page reset-password-page">
      <section className="login-hero" aria-label="Painel decorativo">
        <div className="login-hero__arc" aria-hidden="true" />
        <p className="login-hero__tagline">Evolução · Consistência · Resultados</p>
      </section>

      <section className="login-panel reset-password-panel" aria-label="Painel de redefinição de senha">
        <div className="login-panel__brand">
          <span className="login-panel__logo" aria-hidden="true" />
          <span className="login-panel__brand-name">FITFORGE</span>
        </div>
        <div className="login-panel__divider" aria-hidden="true" />

        <h1 className="login-panel__title">Redefinir senha</h1>
        <p className="login-panel__subtitle">Crie uma nova senha de acesso para a sua conta.</p>

        {!token ? (
          <div className="reset-password-card reset-password-card--error">
            <h2 className="reset-password-card__title">Link inválido ou em falta</h2>
            <p className="reset-password-card__message">
              O link de recuperação que utilizou é inválido ou não contém um token de segurança.
            </p>
            <Link to="/esqueci-minha-senha" className="reset-password-panel__button">
              Solicitar nova recuperação
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="reset-password-card reset-password-card--success">
            <h2 className="reset-password-card__title">Senha alterada com sucesso!</h2>
            <p className="reset-password-card__message">
              A sua senha foi atualizada. Já pode aceder à plataforma com as novas credenciais.
            </p>
            <Link to="/login" className="reset-password-panel__button">
              Ir para o Login
            </Link>
          </div>
        ) : (
          <form className="login-form reset-password-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__field">
              <label htmlFor={passwordId}>Nova senha</label>
              <input
                id={passwordId}
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (passwordError) setPasswordError('')
                }}
                aria-invalid={passwordError ? true : undefined}
                aria-describedby={passwordError ? `${passwordId}-error` : undefined}
                disabled={isSubmitting}
              />
              {passwordError && (
                <p className="login-form__error" id={`${passwordId}-error`}>
                  {passwordError}
                </p>
              )}
            </div>

            <div className="login-form__field">
              <label htmlFor={confirmPasswordId}>Confirmar nova senha</label>
              <input
                id={confirmPasswordId}
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  if (confirmPasswordError) setConfirmPasswordError('')
                }}
                aria-invalid={confirmPasswordError ? true : undefined}
                aria-describedby={confirmPasswordError ? `${confirmPasswordId}-error` : undefined}
                disabled={isSubmitting}
              />
              {confirmPasswordError && (
                <p className="login-form__error" id={`${confirmPasswordId}-error`}>
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {formError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p className="login-form__error login-form__error--form">{formError}</p>
                {formError.toLowerCase().includes('expirado') || formError.toLowerCase().includes('inválido') ? (
                  <Link
                    to="/esqueci-minha-senha"
                    style={{ color: '#e2a83e', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    Solicitar novo link de recuperação
                  </Link>
                ) : null}
              </div>
            )}

            <button type="submit" className="login-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'A guardar...' : 'Guardar nova senha'}
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
