import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera, Check, KeyRound, Shield, Trash2, User } from 'lucide-react'
import { changePassword, getProfileDetails, updateProfile } from '../auth/api'
import type { UserProfileResponse } from '../auth/types'
import { useAuth } from '../auth/useAuth'
import './MeuPerfilPage.css'

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

const AVATAR_STORAGE_KEY_PREFIX = 'fitforge:avatar:'
const VALID_OBJECTIVES = ['hipertrofia', 'emagrecimento', 'condicionamento'] as const
const VALID_LEVELS = ['iniciante', 'intermediario', 'avancado'] as const

export default function MeuPerfilPage() {
  const { user, setUser } = useAuth()

  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState<string | null>(null)

  // Profile Form State
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [objective, setObjective] = useState('hipertrofia')
  const [level, setLevel] = useState('iniciante')
  const [nameError, setNameError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getProfileDetails()
      .then((data) => {
        if (!cancelled) {
          setProfile(data)
          setName(data.name || '')
          // Fallback to local browser persistence if API doesn't persist avatar field yet
          let savedAvatar = data.avatarUrl || null
          if (!savedAvatar && data.email) {
            try {
              savedAvatar = localStorage.getItem(`${AVATAR_STORAGE_KEY_PREFIX}${data.email}`)
            } catch {
              // Ignore localStorage restrictions
            }
          }
          setAvatarUrl(savedAvatar)
          const safeObjective = data.objective && VALID_OBJECTIVES.includes(data.objective as (typeof VALID_OBJECTIVES)[number])
            ? data.objective
            : 'hipertrofia'
          const safeLevel = data.level && VALID_LEVELS.includes(data.level as (typeof VALID_LEVELS)[number])
            ? data.level
            : 'iniciante'
          setObjective(safeObjective)
          setLevel(safeLevel)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorLoading(err instanceof Error ? err.message : 'Não foi possível carregar os dados do perfil.')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setNameError(null)
    setProfileSuccess(null)
    setProfileError(null)

    if (!name.trim()) {
      setNameError('O nome não pode estar vazio.')
      return
    }

    setProfileSaving(true)
    try {
      const payload: {
        name: string
        avatarUrl: string | null
        objective?: string | null
        level?: string | null
      } = {
        name: name.trim(),
        avatarUrl,
      }

      if (profile?.role === 'aluno') {
        payload.objective = VALID_OBJECTIVES.includes(objective as (typeof VALID_OBJECTIVES)[number])
          ? objective
          : 'hipertrofia'
        payload.level = VALID_LEVELS.includes(level as (typeof VALID_LEVELS)[number])
          ? level
          : 'iniciante'
      }

      const updated = await updateProfile(payload)

      // Persist in localStorage to ensure retention across navigation and real backend calls
      if (profile?.email) {
        try {
          if (avatarUrl) {
            localStorage.setItem(`${AVATAR_STORAGE_KEY_PREFIX}${profile.email}`, avatarUrl)
          } else {
            localStorage.removeItem(`${AVATAR_STORAGE_KEY_PREFIX}${profile.email}`)
          }
        } catch {
          // Ignore storage errors
        }
      }

      setProfile({
        ...updated,
        avatarUrl: avatarUrl ?? updated.avatarUrl,
      })
      setProfileSuccess('Perfil atualizado com sucesso!')

      // Sync with global AuthContext immediately so header/sidebar update
      if (user) {
        setUser({
          ...user,
          name: updated.name,
        })
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Erro ao atualizar perfil.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null)
    const file = event.target.files?.[0]
    if (!file) return

    // Limit to 5MB original file
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('A imagem deve ter no máximo 5MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('Por favor selecione um arquivo de imagem válido (PNG, JPG, WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Redimensionar para tamanho ideal de avatar (máx 400x400)
        const canvas = document.createElement('canvas')
        const maxDim = 400
        let { width, height } = img

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          setAvatarUrl(compressedDataUrl)
        } else {
          setAvatarUrl(e.target?.result as string)
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl(null)
    setAvatarError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})
    setPasswordSuccess(null)
    setPasswordError(null)

    const errors: Record<string, string> = {}
    if (!currentPassword) {
      errors.currentPassword = 'A senha atual é obrigatória.'
    }
    if (!newPassword || newPassword.length < 6) {
      errors.newPassword = 'A nova senha deve ter pelo menos 6 caracteres.'
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem.'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordSaving(true)
    try {
      const res = await changePassword({ currentPassword, newPassword })
      setPasswordSuccess(res.message || 'Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Erro ao alterar a senha.')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="meu-perfil-page">
        <div style={{ padding: '4rem', textAlign: 'center', color: '#aaa69d' }}>
          A carregar perfil...
        </div>
      </main>
    )
  }

  if (errorLoading || !profile) {
    return (
      <main className="meu-perfil-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef9e8d' }}>
          <p>{errorLoading || 'Perfil não encontrado.'}</p>
        </div>
      </main>
    )
  }

  const isPersonal = profile.role === 'personal'

  return (
    <main className="meu-perfil-page">
      <header className="meu-perfil-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie as suas informações pessoais e credenciais de segurança.</p>
      </header>

      <div className="meu-perfil-grid">
        {/* Banner with Avatar & Badge */}
        <section className="meu-perfil-banner">
          <div className="meu-perfil-avatar-container">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name || profile.name} className="meu-perfil-avatar meu-perfil-avatar--img" />
            ) : (
              <div className="meu-perfil-avatar">{initials(name || profile.name)}</div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Upload de foto de perfil"
            />
          </div>

          <div className="meu-perfil-banner__info">
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="meu-perfil-badge">
                <Shield size={14} />
                {isPersonal ? 'Personal Trainer' : 'Aluno'}
              </span>

              <button
                type="button"
                className="meu-perfil-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={profileSaving}
              >
                <Camera size={14} />
                {avatarUrl ? 'Trocar foto' : 'Carregar foto'}
              </button>

              {avatarUrl && (
                <button
                  type="button"
                  className="meu-perfil-avatar-btn meu-perfil-avatar-btn--remove"
                  onClick={handleRemoveAvatar}
                  disabled={profileSaving}
                >
                  <Trash2 size={14} />
                  Remover foto
                </button>
              )}
            </div>
            {avatarError && <small style={{ color: '#ef9e8d', display: 'block', marginTop: '0.4rem' }}>{avatarError}</small>}
          </div>
        </section>

        {/* Section 1: Dados do Perfil */}
        <section className="meu-perfil-card">
          <header className="meu-perfil-card__header">
            <h2 className="meu-perfil-card__title">
              <User size={18} color="#e2a83e" />
              Dados Pessoais
            </h2>
          </header>

          <form className="meu-perfil-form" onSubmit={handleSaveProfile} noValidate>
            {profileSuccess && (
              <div className="meu-perfil-alert meu-perfil-alert--success">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="meu-perfil-alert meu-perfil-alert--error">
                {profileError}
              </div>
            )}

            <div className="meu-perfil-form__row">
              <div className="meu-perfil-form__field">
                <label htmlFor="perfil-nome">Nome Completo</label>
                <input
                  id="perfil-nome"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (nameError) setNameError(null)
                  }}
                  disabled={profileSaving}
                />
                {nameError && <small>{nameError}</small>}
              </div>

              <div className="meu-perfil-form__field">
                <label htmlFor="perfil-email">E-mail</label>
                <input
                  id="perfil-email"
                  type="email"
                  value={profile.email}
                  disabled
                  title="O endereço de e-mail não pode ser alterado"
                />
              </div>
            </div>

            {!isPersonal && (
              <div className="meu-perfil-form__row">
                <div className="meu-perfil-form__field">
                  <label htmlFor="perfil-objetivo">Objetivo de Treino</label>
                  <select
                    id="perfil-objetivo"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    disabled={profileSaving}
                  >
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="condicionamento">Condicionamento</option>
                  </select>
                </div>

                <div className="meu-perfil-form__field">
                  <label htmlFor="perfil-nivel">Nível de Experiência</label>
                  <select
                    id="perfil-nivel"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    disabled={profileSaving}
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="meu-perfil-btn" disabled={profileSaving}>
              <Check size={18} />
              {profileSaving ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </form>
        </section>

        {/* Section 2: Segurança & Senha */}
        <section className="meu-perfil-card">
          <header className="meu-perfil-card__header">
            <h2 className="meu-perfil-card__title">
              <KeyRound size={18} color="#e2a83e" />
              Segurança & Senha
            </h2>
          </header>

          <form className="meu-perfil-form" onSubmit={handleChangePassword} noValidate>
            {passwordSuccess && (
              <div className="meu-perfil-alert meu-perfil-alert--success">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="meu-perfil-alert meu-perfil-alert--error">
                {passwordError}
              </div>
            )}

            <div className="meu-perfil-form__field">
              <label htmlFor="current-password">Senha Atual</label>
              <input
                id="current-password"
                type="password"
                placeholder="Introduza a sua senha atual"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }))
                  }
                }}
                disabled={passwordSaving}
              />
              {passwordErrors.currentPassword && <small>{passwordErrors.currentPassword}</small>}
            </div>

            <div className="meu-perfil-form__row">
              <div className="meu-perfil-form__field">
                <label htmlFor="new-password">Nova Senha</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (passwordErrors.newPassword) {
                      setPasswordErrors((prev) => ({ ...prev, newPassword: '' }))
                    }
                  }}
                  disabled={passwordSaving}
                />
                {passwordErrors.newPassword && <small>{passwordErrors.newPassword}</small>}
              </div>

              <div className="meu-perfil-form__field">
                <label htmlFor="confirm-new-password">Confirmar Nova Senha</label>
                <input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }))
                    }
                  }}
                  disabled={passwordSaving}
                />
                {passwordErrors.confirmPassword && <small>{passwordErrors.confirmPassword}</small>}
              </div>
            </div>

            <button type="submit" className="meu-perfil-btn" disabled={passwordSaving}>
              <KeyRound size={18} />
              {passwordSaving ? 'A atualizar...' : 'Atualizar Senha'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
