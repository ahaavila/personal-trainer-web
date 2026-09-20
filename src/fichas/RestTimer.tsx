import { useEffect, useState } from 'react'
import { Hourglass, Pause, Play, RotateCcw } from 'lucide-react'

interface RestTimerProps {
  defaultSeconds?: number
  onFinish?: () => void
}

const PRESETS = [30, 60, 90, 120]

export function RestTimer({ defaultSeconds = 60, onFinish }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(defaultSeconds)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isActive && secondsLeft !== null && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === null) return null
          if (prev <= 1) {
            setIsActive(false)
            onFinish?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, secondsLeft, onFinish])

  const startTimer = (duration: number) => {
    setSelectedDuration(duration)
    setSecondsLeft(duration)
    setIsActive(true)
  }

  const togglePause = () => {
    setIsActive((prev) => !prev)
  }

  const resetTimer = () => {
    setIsActive(false)
    setSecondsLeft(null)
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 1rem',
        background: '#191a18',
        border: '1px solid #33322d',
        borderRadius: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2a83e', fontWeight: 700, fontSize: '0.85rem' }}>
        <Hourglass size={16} />
        <span>Descanso:</span>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem' }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => startTimer(p)}
            style={{
              padding: '0.25rem 0.55rem',
              borderRadius: '0.4rem',
              border: selectedDuration === p && secondsLeft !== null ? '1px solid #e2a83e' : '1px solid #3d3b35',
              background: selectedDuration === p && secondsLeft !== null ? '#2b2311' : '#141513',
              color: selectedDuration === p && secondsLeft !== null ? '#f2c265' : '#aaa69d',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {p}s
          </button>
        ))}
      </div>

      {secondsLeft !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: secondsLeft === 0 ? '#72d96d' : '#f4f0e8',
            }}
          >
            {secondsLeft === 0 ? 'Tempo esgotado!' : formatSeconds(secondsLeft)}
          </span>

          {secondsLeft > 0 && (
            <button
              type="button"
              onClick={togglePause}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#aaa69d',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
              title={isActive ? 'Pausar' : 'Retomar'}
            >
              {isActive ? <Pause size={15} /> : <Play size={15} />}
            </button>
          )}

          <button
            type="button"
            onClick={resetTimer}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#aaa69d',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
            title="Reiniciar"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
