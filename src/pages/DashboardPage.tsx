import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import './DashboardPage.css'

const PERSONAL_SECTIONS = ['Alunos', 'Treinos', 'Financeiro', 'Configurações']
const ALUNO_SECTIONS = ['Meus Treinos', 'Meu Perfil']

function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const sections = user.role === 'personal' ? PERSONAL_SECTIONS : ALUNO_SECTIONS

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
    </main>
  )
}

export default DashboardPage
