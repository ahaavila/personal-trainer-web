import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { Activity, ArrowRight, CalendarDays, Check, Dumbbell, Plus, Users } from 'lucide-react'
import { getDashboardForRole } from '../dashboard/api'
import type { DashboardData, PersonalDashboardData, StudentDashboardData, WeeklyPoint } from '../dashboard/types'
import { useAuth } from '../auth/useAuth'
import './DashboardPage.css'

function formatDate() {
  return new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
}

function isPersonalData(data: DashboardData): data is PersonalDashboardData {
  return 'metrics' in data
}

function WeeklyBars({ points }: { points: WeeklyPoint[] }) {
  const max = Math.max(...points.map((point) => point.value), 1)
  return (
    <div className="dashboard-bars" aria-label="Evolução semanal">
      {points.map((point) => (
        <div className="dashboard-bars__item" key={point.label}>
          <div className="dashboard-bars__track"><div className="dashboard-bars__bar" style={{ height: `${Math.max((point.value / max) * 100, point.value ? 12 : 0)}%` }} title={`${point.label}: ${point.value}`} /></div>
          <span>{point.label}</span>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="dashboard-section__header"><div><h2>{title}</h2><p>{subtitle}</p></div></header>
}

function PersonalDashboard({ data, userName }: { data: PersonalDashboardData; userName: string }) {
  const metrics = [
    { label: 'Clientes', value: data.metrics.clients, detail: '+1 este mês', icon: Users },
    { label: 'Clientes ativos', value: data.metrics.activeClients, detail: 'Acompanhamento em dia', icon: Activity },
    { label: 'Exercícios', value: data.metrics.exercises, detail: 'Biblioteca atualizada', icon: Dumbbell },
    { label: 'Fichas de treino', value: data.metrics.trainingPlans, detail: '4 publicadas', icon: CalendarDays },
  ]
  return <div className="dashboard-view">
    <div className="dashboard-view__header"><div><span className="dashboard-view__date">{formatDate()}</span><h1>Olá, {userName}.</h1><p>Aqui está o panorama dos seus acompanhamentos hoje.</p></div><div className="dashboard-view__actions"><Link className="dashboard-button dashboard-button--muted" to="/exercicios"><Plus size={17} /> Novo exercício</Link><Link className="dashboard-button dashboard-button--primary" to="/clientes"><Users size={17} /> Adicionar cliente</Link></div></div>
    <div className="dashboard-metrics">{metrics.map(({ label, value, detail, icon: Icon }) => <article className="dashboard-metric" key={label}><span className="dashboard-metric__icon"><Icon size={18} /></span><strong>{value}</strong><h2>{label}</h2><p>{detail}</p></article>)}</div>
    <div className="dashboard-grid"><section className="dashboard-section dashboard-section--schedule"><SectionHeader title="Próximos treinos" subtitle="Agenda organizada para hoje" />{data.upcomingTrainings.length === 0 ? <p className="dashboard-empty">Nenhum treino agendado para hoje.</p> : <div className="dashboard-training-list">{data.upcomingTrainings.map((training) => <div className="dashboard-training" key={`${training.time}-${training.clientName}`}><time>{training.time}</time><span className="dashboard-training__avatar">{training.clientName.slice(0, 2).toUpperCase()}</span><div><strong>{training.clientName}</strong><p>{training.context}</p></div><span className="dashboard-status"><Check size={12} /> Confirmado</span></div>)}</div>}</section><section className="dashboard-section dashboard-section--evolution"><SectionHeader title="Evolução da semana" subtitle="Presenças registadas nos últimos dias" /><WeeklyBars points={data.weeklyEvolution} /></section></div>
  </div>
}

function StudentDashboard({ data, userName }: { data: StudentDashboardData; userName: string }) {
  return <div className="dashboard-view"><div className="dashboard-view__header dashboard-view__header--student"><div><span className="dashboard-view__date">{formatDate()}</span><h1>Olá, {userName}.</h1><p>Acompanhe a sua evolução e mantenha o ritmo.</p></div><span className="dashboard-student-badge">Aluno</span></div><section className="dashboard-section dashboard-plan"><SectionHeader title="Ficha de treino atual" subtitle="O seu plano de treino" />{data.currentPlan ? <div className="dashboard-plan__content"><div><strong>{data.currentPlan.title}</strong><p>{data.progress.completedWorkouts} de {data.progress.totalWorkouts} treinos concluídos</p></div><div className="dashboard-progress"><span style={{ width: `${data.currentPlan.progress}%` }} /></div><strong>{data.currentPlan.progress}%</strong></div> : <p className="dashboard-empty">Ainda não tem uma ficha de treino ativa.</p>}</section><div className="dashboard-grid dashboard-grid--student"><section className="dashboard-section"><SectionHeader title="Próximos treinos" subtitle="O que vem a seguir" />{data.nextWorkouts.length === 0 ? <p className="dashboard-empty">Nenhum treino planeado.</p> : <div className="dashboard-student-list">{data.nextWorkouts.map((workout) => <div className="dashboard-student-workout" key={workout.name}><span className="dashboard-metric__icon"><Dumbbell size={18} /></span><div><strong>{workout.name}</strong><p>{workout.exerciseCount} exercícios</p></div><span>{workout.scheduledFor}</span></div>)}</div>}</section><section className="dashboard-section"><SectionHeader title="Atividade da semana" subtitle="Os seus treinos recentes" /><WeeklyBars points={data.weeklyActivity} /></section></div><Link className="dashboard-link" to="/treinos">Ver todos os treinos <ArrowRight size={16} /></Link></div>
}

function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loadedRole, setLoadedRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getDashboardForRole(user.role).then((nextData) => {
      if (!cancelled) {
        setData(nextData)
        setLoadedRole(user.role)
        setError(null)
      }
    }).catch(() => {
      if (!cancelled) {
        setLoadedRole(user.role)
        setError('Não foi possível carregar o seu dashboard.')
      }
    })
    return () => { cancelled = true }
  }, [user, retry])

  if (!user) return <Navigate to="/login" replace />
  if (loadedRole !== user.role) return <main className="dashboard-state"><span className="dashboard-view__date">A carregar</span><h1>Estamos a preparar o seu panorama.</h1></main>
  if (error) return <main className="dashboard-state"><span className="dashboard-view__date">Algo correu mal</span><h1>{error}</h1><button className="dashboard-button dashboard-button--primary" onClick={() => { setError(null); setLoadedRole(null); setRetry((value) => value + 1) }}>Tentar novamente</button></main>
  if (!data) return null
  return isPersonalData(data) ? <PersonalDashboard data={data} userName={user.name} /> : <StudentDashboard data={data} userName={user.name} />
}

export default DashboardPage
