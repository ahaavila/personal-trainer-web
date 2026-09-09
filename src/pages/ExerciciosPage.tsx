import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Plus, Search } from 'lucide-react'
import { getExercises } from '../exercicios/api'
import type { ExerciseListItem } from '../exercicios/types'
import './ExerciciosPage.css'

const LEVEL_LABELS = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' }

function ExerciciosPage() {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([])
  const [search, setSearch] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('all')
  const [level, setLevel] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    getExercises().then((items) => { if (!cancelled) { setExercises(items); setError(null); setLoading(false) } }).catch(() => { if (!cancelled) { setError('Não foi possível carregar a sua biblioteca de exercícios.'); setLoading(false) } })
    return () => { cancelled = true }
  }, [retry])

  const groups = [...new Set(exercises.map((exercise) => exercise.muscleGroup))]
  const levels = [...new Set(exercises.map((exercise) => exercise.level))]
  const filtered = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    return matchesSearch && (muscleGroup === 'all' || exercise.muscleGroup === muscleGroup) && (level === 'all' || exercise.level === level)
  })

  return <main className="exercises-page">
    <header className="exercises-page__header"><div><h1>Exercícios</h1><p>A sua biblioteca de movimentos para montar treinos consistentes.</p></div><Link className="exercises-page__new" to="/novo-exercicio"><Plus size={18} /> Novo exercício</Link></header>
    <section className="exercises-library">
      <div className="exercises-filters"><label className="exercises-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar exercício" /></label><select aria-label="Filtrar por grupo muscular" value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)}><option value="all">Todos os grupos musculares</option>{groups.map((group) => <option key={group}>{group}</option>)}</select><select aria-label="Filtrar por nível" value={level} onChange={(event) => setLevel(event.target.value)}><option value="all">Todos os níveis</option>{levels.map((item) => <option key={item} value={item}>{LEVEL_LABELS[item]}</option>)}</select></div>
      {loading ? <p className="exercises-state">A carregar exercícios...</p> : error ? <div className="exercises-state"><p>{error}</p><button type="button" onClick={() => { setLoading(true); setError(null); setRetry((value) => value + 1) }}>Tentar novamente</button></div> : exercises.length === 0 ? <p className="exercises-state">Ainda não tem exercícios na sua biblioteca.</p> : filtered.length === 0 ? <p className="exercises-state">Nenhum exercício corresponde aos filtros selecionados.</p> : <div className="exercise-grid">{filtered.map((exercise) => <article className="exercise-card" key={exercise.name}><div className="exercise-card__meta"><span>{exercise.muscleGroup}</span><small>{LEVEL_LABELS[exercise.level]}</small></div><h2>{exercise.name}</h2><p>{exercise.description}</p><div className="exercise-card__defaults"><div><strong>Séries</strong><span>{exercise.defaultSets}</span></div><div><strong>Reps.</strong><span>{exercise.defaultReps}</span></div></div></article>)}</div>}
    </section>
  </main>
}

export default ExerciciosPage
