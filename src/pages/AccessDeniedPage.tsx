import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router'
import './AccessDeniedPage.css'

function AccessDeniedPage() {
  return (
    <main className="access-denied-page">
      <span className="access-denied-page__icon"><LockKeyhole size={24} /></span>
      <span className="access-denied-page__code">Erro 403</span>
      <h1>Acesso não autorizado</h1>
      <p>Não tem permissão para aceder a esta área.</p>
      <Link to="/dashboard">Voltar ao dashboard</Link>
    </main>
  )
}

export default AccessDeniedPage
