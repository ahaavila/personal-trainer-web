import { useEffect, useState } from 'react'
import { Check, FastForward, Play, Pause, X } from 'lucide-react'
import './RestCountdownPopup.css'

interface RestCountdownPopupProps {
  initialSeconds: number
  exerciseName: string
  completedSetNumber: number
  nextInfo?: string
  onClose: () => void
}

export function RestCountdownPopup({
  initialSeconds,
  exerciseName,
  completedSetNumber,
  nextInfo,
  onClose,
}: RestCountdownPopupProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (!isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPaused, secondsLeft])

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const addTime = (seconds: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + seconds))
  }

  const handleSkipOrClose = () => {
    setSecondsLeft(0)
    onClose()
  }

  const isFinished = secondsLeft === 0

  return (
    <div className="rest-popup-overlay" role="dialog" aria-modal="true" aria-label="Tempo de descanso">
      <div className="rest-popup-card">
        <button
          type="button"
          className="rest-popup-close-btn"
          onClick={handleSkipOrClose}
          title="Fechar e iniciar próxima série"
        >
          <X size={20} />
        </button>

        <span className="rest-popup-title">Intervalo de Descanso</span>
        <h3 className="rest-popup-context">
          {exerciseName} · Série #{completedSetNumber} concluída!
        </h3>
        {nextInfo && <p className="rest-popup-subcontext">{nextInfo}</p>}

        <div className={`rest-popup-timer-circle ${isFinished ? 'rest-popup-timer-circle--finished' : 'rest-popup-timer-circle--active'}`}>
          <div className="rest-popup-timer-digits">
            {formatTime(secondsLeft)}
          </div>
          <span className="rest-popup-timer-status">
            {isFinished ? 'Descanso finalizado!' : isPaused ? 'Pausado' : 'A recuperar...'}
          </span>
        </div>

        {!isFinished && (
          <div className="rest-popup-adjust-row">
            <button type="button" className="rest-popup-adjust-btn" onClick={() => addTime(-15)}>
              -15s
            </button>
            <button
              type="button"
              className="rest-popup-adjust-btn"
              onClick={() => setIsPaused((prev) => !prev)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? 'Retomar' : 'Pausar'}
            </button>
            <button type="button" className="rest-popup-adjust-btn" onClick={() => addTime(+15)}>
              +15s
            </button>
            <button type="button" className="rest-popup-adjust-btn" onClick={() => addTime(+30)}>
              +30s
            </button>
          </div>
        )}

        <div className="rest-popup-actions">
          <button type="button" className="rest-popup-skip-btn" onClick={handleSkipOrClose}>
            {isFinished ? (
              <>
                <Check size={18} />
                <span>Começar Próxima Série</span>
              </>
            ) : (
              <>
                <FastForward size={18} />
                <span>Pular Descanso & Iniciar Série</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
