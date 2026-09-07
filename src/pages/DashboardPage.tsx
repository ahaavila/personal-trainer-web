import { Navigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import './DashboardPage.css'

function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="dashboard-page">
      <h1>Olá, {user.name}</h1>
      <p className="dashboard-page__role">
        Perfil: {user.role === 'personal' ? 'Personal Trainer' : 'Aluno'}
      </p>
      <p className="dashboard-page__intro">
        Selecione uma opção no menu para continuar.
      </p>
    </main>
  )
}

export default DashboardPage
