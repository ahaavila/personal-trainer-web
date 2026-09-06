import { useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from '../auth/api'
import { useAuth } from '../auth/useAuth'
import './LoginPage.css'

function LoginPage() {
  const emailId = useId()
  const passwordId = useId()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    setEmailError(trimmedEmail ? null : 'Informe seu e-mail.')
    setPasswordError(trimmedPassword ? null : 'Informe sua senha.')

    if (!trimmedEmail || !trimmedPassword) {
      return
    }

    setIsSubmitting(true)
    try {
      const user = await login({ email: trimmedEmail, password: trimmedPassword })
      setUser(user)
      navigate('/dashboard')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível entrar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-hero" aria-hidden="true">
        <div className="login-hero__arc" />
        <p className="login-hero__tagline">PERFORMANCE / PRECISION / PROGRESS</p>
      </section>

      <section className="login-panel">
        <div className="login-panel__brand">
          <span className="login-panel__logo" aria-hidden="true" />
          <span className="login-panel__brand-name">FITFORGE</span>
        </div>

        <div className="login-panel__divider" />

        <h1 className="login-panel__title">Bem-vindo de volta</h1>
        <p className="login-panel__subtitle">Acesse sua conta para continuar seus treinos.</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form__field">
            <label htmlFor={emailId}>E-mail</label>
            <input
              id={emailId}
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? `${emailId}-error` : undefined}
            />
            {emailError && (
              <p className="login-form__error" id={`${emailId}-error`}>
                {emailError}
              </p>
            )}
          </div>

          <div className="login-form__field">
            <label htmlFor={passwordId}>Senha</label>
            <input
              id={passwordId}
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? `${passwordId}-error` : undefined}
            />
            {passwordError && (
              <p className="login-form__error" id={`${passwordId}-error`}>
                {passwordError}
              </p>
            )}
          </div>

          <div className="login-form__row">
            <label className="login-form__checkbox">
              <input type="checkbox" />
              Lembrar de mim
            </label>
            <a className="login-form__link" href="#forgot-password" onClick={(e) => e.preventDefault()}>
              Esqueci minha senha?
            </a>
          </div>

          <button type="submit" className="login-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {formError && <p className="login-form__error login-form__error--form">{formError}</p>}

          <div className="login-form__divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="login-form__google"
            onClick={(event) => event.preventDefault()}
          >
            <span className="login-form__google-icon" aria-hidden="true">
              G
            </span>
            Continuar com Google
          </button>
        </form>

        <p className="login-panel__footer">
          Ainda não tem uma conta? <a href="#contact-trainer" onClick={(e) => e.preventDefault()}>Fale com seu personal trainer.</a>
        </p>
      </section>
    </div>
  )
}

export default LoginPage
