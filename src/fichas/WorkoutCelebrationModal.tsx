import { CheckCircle2, Clock, Dumbbell, Trophy } from 'lucide-react'
import type { CreateWorkoutExecutionPayload } from '../progresso/types'

interface WorkoutCelebrationModalProps {
  payload: CreateWorkoutExecutionPayload
  onClose: () => void
}

export function WorkoutCelebrationModal({ payload, onClose }: WorkoutCelebrationModalProps) {
  const totalSets = payload.exercicios.reduce((acc, curr) => acc + curr.setsCompleted, 0)
  const maxLoad = Math.max(0, ...payload.exercicios.map((e) => e.maxWeightKg))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 11, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #1b1c19, #131412)',
          border: '1px solid #e2a83e',
          borderRadius: '1.25rem',
          maxWidth: '32rem',
          width: '100%',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(226, 168, 62, 0.2)',
          color: '#f4f0e8',
        }}
      >
        <div
          style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0c65e, #bd8c27)',
            color: '#211909',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Trophy size={36} />
        </div>

        <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem', color: '#f4f0e8' }}>
          Treino Concluído!
        </h2>
        <p style={{ color: '#aaa69d', margin: '0 0 2rem', fontSize: '0.95rem' }}>
          Excelente trabalho! O seu treino foi registrado com sucesso e já está disponível na sua evolução.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ background: '#191a18', border: '1px solid #33322d', borderRadius: '0.75rem', padding: '1rem' }}>
            <Clock size={18} color="#e2a83e" style={{ margin: '0 auto 0.4rem' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{payload.durationMinutes}m</div>
            <div style={{ fontSize: '0.72rem', color: '#8f877b', textTransform: 'uppercase' }}>Duração</div>
          </div>

          <div style={{ background: '#191a18', border: '1px solid #33322d', borderRadius: '0.75rem', padding: '1rem' }}>
            <CheckCircle2 size={18} color="#72d96d" style={{ margin: '0 auto 0.4rem' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalSets}</div>
            <div style={{ fontSize: '0.72rem', color: '#8f877b', textTransform: 'uppercase' }}>Séries Feitas</div>
          </div>

          <div style={{ background: '#191a18', border: '1px solid #33322d', borderRadius: '0.75rem', padding: '1rem' }}>
            <Dumbbell size={18} color="#f2c265" style={{ margin: '0 auto 0.4rem' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{maxLoad} kg</div>
            <div style={{ fontSize: '0.72rem', color: '#8f877b', textTransform: 'uppercase' }}>Carga Pico</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            minHeight: '2.8rem',
            border: 'none',
            borderRadius: '0.6rem',
            background: 'linear-gradient(135deg, #f0c65e, #bd8c27)',
            color: '#211909',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Concluir e Voltar
        </button>
      </div>
    </div>
  )
}
