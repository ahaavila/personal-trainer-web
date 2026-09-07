import { Navigate, useNavigate } from 'react-router'
import { logout } from '../auth/api'
import { useAuth } from '../auth/useAuth'
import './DashboardPage.css'

const PERSONAL_SECTIONS = ['Alunos', 'Treinos', 'Financeiro', 'Configurações']
const ALUNO_SECTIONS = ['Meus Treinos', 'Meu Perfil']

function DashboardPage() {
  const { user, clearUser } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const sections = user.role === 'personal' ? PERSONAL_SECTIONS : ALUNO_SECTIONS

  async function handleLogout() {
    await logout()
    clearUser()
    navigate('/login')
  }

  return (
    <main className="dashboard-page">
      <h1>Olá, {user.name}</h1>
      <p className="dashboard-page__role">
        Perfil: {user.role === 'personal' ? 'Personal Trainer' : 'Aluno'}
      </p>
      <ul className="dashboard-page__sections">
        {sections.map((section) => (
          <li key={section}>{section}</li>
        ))}
      </ul>
      <button type="button" className="dashboard-page__logout" onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}

export default DashboardPage
