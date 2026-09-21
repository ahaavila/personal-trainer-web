import { useState, useEffect } from 'react'
import { Video, X } from 'lucide-react'
import { getExerciseMedia } from './api'
import type { ExerciseMediaItem } from './types'
import './ExerciseMediaViewerModal.css'

interface ExerciseMediaViewerModalProps {
  readonly exerciseId?: number
  readonly exerciseName: string
  readonly initialMedia?: ExerciseMediaItem[]
  readonly onClose: () => void
}

export function ExerciseMediaViewerModal({
  exerciseId,
  exerciseName,
  initialMedia,
  onClose,
}: ExerciseMediaViewerModalProps) {
  // If initial media items already have presigned URLs, use them directly; otherwise fetch them from the media API
  const hasLoadedUrls = Boolean(initialMedia && initialMedia.length > 0 && initialMedia.some((m) => Boolean(m.url)))
  const [fetchedMedia, setFetchedMedia] = useState<ExerciseMediaItem[]>([])
  const [loading, setLoading] = useState<boolean>(!hasLoadedUrls && Boolean(exerciseId))

  useEffect(() => {
    if (hasLoadedUrls || !exerciseId) return

    let cancelled = false

    getExerciseMedia(exerciseId)
      .then((items) => {
        if (!cancelled) {
          setFetchedMedia(items)
        }
      })
      .catch(() => {
        if (!cancelled) setFetchedMedia([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [exerciseId, hasLoadedUrls])

  const mediaList = hasLoadedUrls ? (initialMedia ?? []) : fetchedMedia
  const video = mediaList.find((m) => m.kind === 'video')
  const photo = mediaList.find((m) => m.kind === 'photo')
  const [videoPlaybackError, setVideoPlaybackError] = useState(false)

  const renderContent = () => {
    if (loading) {
      return <div className="exercise-media-empty">Carregando vídeo...</div>
    }

    if (video?.url) {
      if (videoPlaybackError) {
        return (
          <div className="exercise-media-empty" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <span>Não foi possível carregar o player de vídeo incorporado.</span>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--brand-primary, #e2a83e)',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              Abrir vídeo em nova aba
            </a>
          </div>
        )
      }

      return (
        <div className="exercise-media-player-wrapper">
          <video
            src={video.url}
            controls
            autoPlay
            playsInline
            className="exercise-media-video"
            onError={() => setVideoPlaybackError(true)}
          >
            <track kind="captions" />
          </video>
        </div>
      )
    }

    if (photo?.url) {
      return (
        <div className="exercise-media-player-wrapper">
          <img src={photo.url} alt={exerciseName} className="exercise-media-photo" />
        </div>
      )
    }

    return (
      <div className="exercise-media-empty">
        Nenhuma mídia ou vídeo disponível para este exercício.
      </div>
    )
  }

  return (
    <div className="exercise-media-overlay" role="presentation" onClick={onClose}>
      <div
        className="exercise-media-container"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="exercise-media-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="exercise-media-badge-icon">
              <Video size={16} color="var(--brand-primary, #e2a83e)" />
            </span>
            <h3>{exerciseName}</h3>
          </div>
          <button
            type="button"
            className="exercise-media-close-btn"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="exercise-media-body">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
