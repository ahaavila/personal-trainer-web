import { useId, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login } from '../auth/api'
import { useAuth } from '../auth/useAuth'
import './LoginPage.css'

const REMEMBERED_EMAIL_KEY = 'fitforge:remembered_email'

function LoginPage() {
  const emailId = useId()
  const passwordId = useId()
  const rememberMeId = useId()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(REMEMBERED_EMAIL_KEY) || ''
    } catch {
      return ''
    }
  })
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY))
    } catch {
      return false
    }
  })
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
      const user = await login({
        email: trimmedEmail,
        password: trimmedPassword,
        rememberMe,
      })

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail)
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY)
        }
      } catch {
        // Ignore storage errors if localStorage is restricted
      }

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
            <label className="login-form__checkbox" htmlFor={rememberMeId}>
              <input
                id={rememberMeId}
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Lembrar de mim
            </label>
            <Link className="login-form__link" to="/esqueci-minha-senha">
              Esqueci minha senha?
            </Link>
          </div>

          <button type="submit" className="login-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {formError && <p className="login-form__error login-form__error--form">{formError}</p>}
        </form>

        <p className="login-panel__footer">
          Ainda não tem uma conta? <a href="#contact-trainer" onClick={(e) => e.preventDefault()}>Fale com seu personal trainer.</a>
        </p>
      </section>
    </div>
  )
}

export default LoginPage
