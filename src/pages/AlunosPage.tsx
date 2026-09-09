import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Search, UserPlus } from 'lucide-react'
import { getAlunos } from '../alunos/api'
import type { AlunoListItem, AlunoStatus } from '../alunos/types'
import './AlunosPage.css'

const STATUS_LABELS: Record<AlunoStatus, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  'não informado': 'Não informado',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function latestWorkoutLabel(aluno: AlunoListItem) {
  if (!aluno.latestWorkout) return 'Sem treinos registados'
  return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short' }).format(new Date(aluno.latestWorkout.completedAt))
}

function AlunosPage() {
  const [alunos, setAlunos] = useState<AlunoListItem[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | AlunoStatus>('all')
  const [objective, setObjective] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    getAlunos()
      .then((nextAlunos) => {
        if (!cancelled) {
          setAlunos(nextAlunos)
          setError(null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Não foi possível carregar os seus alunos.')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [retry])

  const objectives = [...new Set(alunos.map((aluno) => aluno.objective).filter((value) => value !== 'não informado'))]
  const filteredAlunos = alunos.filter((aluno) => {
    const needle = search.trim().toLocaleLowerCase()
    const matchesSearch = !needle || aluno.name.toLocaleLowerCase().includes(needle) || aluno.email.toLocaleLowerCase().includes(needle)
    return matchesSearch && (status === 'all' || aluno.status === status) && (objective === 'all' || aluno.objective === objective)
  })

  return (
    <main className="alunos-page">
      <header className="alunos-page__header">
        <div><h1>Alunos</h1><p>Acompanhe perfis, objetivos e progresso dos seus alunos.</p></div>
        <Link className="alunos-page__new" to="/criar-utilizador"><UserPlus size={18} /> Novo aluno</Link>
      </header>

      <section className="alunos-table-card">
        <div className="alunos-filters">
          <label className="alunos-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar por nome ou e-mail" /></label>
          <select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value as 'all' | AlunoStatus)}><option value="all">Todos os estados</option><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select>
          <select aria-label="Filtrar por objetivo" value={objective} onChange={(event) => setObjective(event.target.value)}><option value="all">Todos os objetivos</option>{objectives.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        </div>

        {loading ? <p className="alunos-state">A carregar alunos...</p> : error ? <div className="alunos-state"><p>{error}</p><button type="button" onClick={() => { setLoading(true); setError(null); setRetry((value) => value + 1) }}>Tentar novamente</button></div> : alunos.length === 0 ? <p className="alunos-state">Ainda não tem alunos associados.</p> : filteredAlunos.length === 0 ? <p className="alunos-state">Nenhum aluno corresponde aos filtros selecionados.</p> : <div className="alunos-table-wrap"><table className="alunos-table"><thead><tr><th>Aluno</th><th>Objetivo</th><th>Nível</th><th>Último treino</th><th>Estado</th></tr></thead><tbody>{filteredAlunos.map((aluno) => <tr key={aluno.email}><td data-label="Aluno"><span className="alunos-avatar">{initials(aluno.name)}</span><span><strong>{aluno.name}</strong><small>{aluno.email}</small></span></td><td data-label="Objetivo">{aluno.objective}</td><td data-label="Nível">{aluno.level}</td><td data-label="Último treino">{latestWorkoutLabel(aluno)}</td><td data-label="Estado"><span className={`alunos-status alunos-status--${aluno.status.replace(' ', '-')}`}>{STATUS_LABELS[aluno.status]}</span></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  )
}

export default AlunosPage
