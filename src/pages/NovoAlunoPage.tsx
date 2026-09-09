import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { createAluno } from '../alunos/api'
import type { CreateAlunoInput } from '../alunos/types'
import './NovoAlunoPage.css'

type FormValues = CreateAlunoInput & { passwordConfirmation: string }
type FieldName = keyof FormValues

const INITIAL_FORM: FormValues = {
  name: '', email: '', password: '', passwordConfirmation: '', objective: 'hipertrofia', level: 'iniciante',
}

function NovoAlunoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormValues>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function updateField(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function validate() {
    const nextErrors: Partial<Record<FieldName, string>> = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Informe o nome completo do aluno.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'Informe um e-mail válido.'
    if (form.password.length < 8) nextErrors.password = 'A senha temporária precisa ter pelo menos 8 caracteres.'
    if (form.password !== form.passwordConfirmation) nextErrors.passwordConfirmation = 'As senhas não coincidem.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createAluno({
        name: form.name.trim(), email: form.email.trim(), password: form.password,
        objective: form.objective, level: form.level,
      })
      navigate('/alunos', { state: { createdAluno: form.name.trim() } })
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Não foi possível criar o aluno.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="novo-aluno-page">
    <header className="novo-aluno-page__header">
      <div><span>Novo aluno</span><h1>Criar conta de aluno</h1><p>Defina os dados iniciais para vincular o aluno ao seu acompanhamento.</p></div>
      <Link to="/alunos">Voltar para alunos</Link>
    </header>
    <form className="novo-aluno-form" onSubmit={handleSubmit} noValidate>
      <section><h2>Dados de acesso</h2><p>O aluno usará esta senha temporária no primeiro login.</p>
        <div className="novo-aluno-form__grid"><Field label="Nome completo" error={errors.name}><input value={form.name} onChange={(event) => updateField('name', event.target.value)} autoComplete="name" /></Field><Field label="E-mail" error={errors.email}><input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" /></Field></div>
        <div className="novo-aluno-form__grid"><Field label="Senha temporária" error={errors.password}><span className="novo-aluno-form__password"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => updateField('password', event.target.value)} autoComplete="new-password" /><button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></Field><Field label="Confirmar senha" error={errors.passwordConfirmation}><input type={showPassword ? 'text' : 'password'} value={form.passwordConfirmation} onChange={(event) => updateField('passwordConfirmation', event.target.value)} autoComplete="new-password" /></Field></div>
      </section>
      <section><h2>Perfil de treino</h2><p>Essas informações aparecem na sua lista de alunos.</p><div className="novo-aluno-form__grid"><Field label="Objetivo"><select value={form.objective} onChange={(event) => updateField('objective', event.target.value)}><option value="hipertrofia">Hipertrofia</option><option value="emagrecimento">Emagrecimento</option><option value="condicionamento">Condicionamento</option></select></Field><Field label="Nível"><select value={form.level} onChange={(event) => updateField('level', event.target.value)}><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option></select></Field></div></section>
      {serverError && <p className="novo-aluno-form__server-error" role="alert">{serverError}</p>}
      <footer><Link to="/alunos">Cancelar</Link><button type="submit" disabled={isSubmitting}><UserPlus size={18} /> {isSubmitting ? 'A criar...' : 'Criar aluno'}</button></footer>
    </form>
  </main>
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="novo-aluno-form__field"><span>{label}</span>{children}{error && <small role="alert">{error}</small>}</label>
}

export default NovoAlunoPage
