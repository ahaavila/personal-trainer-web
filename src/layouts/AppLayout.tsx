import { useState, useRef, useEffect, useMemo } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router'
import { ChevronDown, Dumbbell, LogOut, Search, User, Users, X } from 'lucide-react'
import { logout } from '../auth/api'
import { useAuth } from '../auth/useAuth'
import { getAlunos } from '../alunos/api'
import { getExercises } from '../exercicios/api'
import { applyTheme, getBranding } from '../branding/api'
import type { AlunoListItem } from '../alunos/types'
import type { ExerciseListItem } from '../exercicios/types'
import { ALUNO_MENU_ITEMS, PERSONAL_MENU_ITEMS } from '../navigation/menuItems'
import './AppLayout.css'

const AVATAR_STORAGE_KEY_PREFIX = 'fitforge:avatar:'

function getInitials(name?: string): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function AppLayout() {
  const { user, clearUser } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Search state (Personal Trainer only)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [alunos, setAlunos] = useState<AlunoListItem[]>([])
  const [exercises, setExercises] = useState<ExerciseListItem[]>([])

  const userKey = user?.name ? user.name.toLowerCase().replace(/\s+/g, '.') : 'user'

  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (!user?.name) return null
    try {
      return localStorage.getItem(`${AVATAR_STORAGE_KEY_PREFIX}${userKey}`)
    } catch {
      return null
    }
  })

  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null)

  // Load and apply custom branding (for PRO personal trainer or student of PRO personal)
  useEffect(() => {
    if (!user) return
    let cancelled = false

    const loadBranding = () => {
      getBranding()
        .then((res) => {
          if (cancelled) return
          if (res.branding.logoUrl || res.branding.primaryColor || res.branding.backgroundColor) {
            setCustomLogoUrl(res.branding.logoUrl)
            applyTheme(res.branding.primaryColor, res.branding.backgroundColor)
          } else {
            setCustomLogoUrl(null)
            applyTheme(null, null)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setCustomLogoUrl(null)
            applyTheme(null, null)
          }
        })
    }

    loadBranding()
    window.addEventListener('fitforge:branding_updated', loadBranding)

    return () => {
      cancelled = true
      window.removeEventListener('fitforge:branding_updated', loadBranding)
    }
  }, [user])

  // Load search pool only if user is Personal Trainer
  useEffect(() => {
    if (user?.role !== 'personal') return
    let cancelled = false

    getExercises()
      .then((items) => {
        if (!cancelled) setExercises(items)
      })
      .catch(() => {
        if (!cancelled) setExercises([])
      })

    getAlunos()
      .then((items) => {
        if (!cancelled) setAlunos(items)
      })
      .catch(() => {
        if (!cancelled) setAlunos([])
      })

    return () => {
      cancelled = true
    }
  }, [user])

  // Keep avatar updated if changed in MeuPerfil
  useEffect(() => {
    if (!user?.name) return
    const key = `${AVATAR_STORAGE_KEY_PREFIX}${userKey}`
    const updateAvatar = () => {
      try {
        setAvatarUrl(localStorage.getItem(key))
      } catch {
        // Ignore
      }
    }
    window.addEventListener('storage', updateAvatar)
    return () => window.removeEventListener('storage', updateAvatar)
  }, [user?.name, userKey])

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return { matchingAlunos: [], matchingExercises: [] }

    const matchingAlunos = alunos.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
    ).slice(0, 5)

    const matchingExercises = exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroup.toLowerCase().includes(q) ||
        Boolean(e.equipment?.toLowerCase().includes(q)),
    ).slice(0, 5)

    return { matchingAlunos, matchingExercises }
  }, [searchQuery, alunos, exercises])

  // Dismiss user menu & search dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const menuItems = user.role === 'personal' ? PERSONAL_MENU_ITEMS : ALUNO_MENU_ITEMS
  const roleLabel = user.role === 'personal' ? 'Personal Trainer' : 'Aluno'

  async function handleLogout() {
    setIsUserMenuOpen(false)
    await logout()
    clearUser()
    navigate('/login')
  }

  function handleNavigateToProfile() {
    setIsUserMenuOpen(false)
    navigate('/meu-perfil')
  }

  function handleSelectAluno(aluno: AlunoListItem) {
    setIsSearchOpen(false)
    setSearchQuery('')
    navigate(`/evolucao?alunoId=${aluno.id || 1}`)
  }

  function handleSelectExercise(exercise: ExerciseListItem) {
    setIsSearchOpen(false)
    setSearchQuery('')
    navigate(`/exercicios?exerciseId=${exercise.id}`)
  }

  const hasResults =
    searchResults.matchingAlunos.length > 0 || searchResults.matchingExercises.length > 0

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <span className="app-sidebar__logo" aria-hidden="true">
            {customLogoUrl ? (
              <img src={customLogoUrl} alt="Logo personalizada" className="app-sidebar__custom-logo" />
            ) : (
              <Dumbbell size={19} strokeWidth={2.5} />
            )}
          </span>
          <span>FitManager Pro</span>
        </div>

        <nav aria-label="Navegação principal" className="app-sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
              }
            >
              <item.icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="app-sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </aside>

      <div className="app-main">
        <header className="app-header">
          {user.role === 'personal' ? (
            <div className="app-header__search" ref={searchContainerRef}>
              <Search size={17} className="app-header__search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Pesquisar clientes ou exercícios..."
                className="app-header__search-input"
                aria-label="Pesquisar clientes ou exercícios"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchOpen(true)
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="app-header__search-clear-btn"
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchOpen(false)
                  }}
                  aria-label="Limpar pesquisa"
                >
                  <X size={14} />
                </button>
              )}

              {isSearchOpen && searchQuery.trim().length > 0 && (
                <section className="app-header__search-dropdown" aria-label="Resultados da pesquisa">
                  {hasResults ? (
                    <>
                      {searchResults.matchingAlunos.length > 0 && (
                        <div className="search-dropdown-group">
                          <div className="search-dropdown-group-header">
                            <Users size={13} />
                            <span>Clientes / Alunos</span>
                          </div>
                          {searchResults.matchingAlunos.map((aluno) => (
                            <button
                              key={aluno.email}
                              type="button"
                              className="search-dropdown-item"
                              onClick={() => handleSelectAluno(aluno)}
                            >
                              <span className="search-dropdown-avatar">
                                {getInitials(aluno.name)}
                              </span>
                              <div className="search-dropdown-info">
                                <strong>{aluno.name}</strong>
                                <small>{aluno.email}</small>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.matchingExercises.length > 0 && (
                        <div className="search-dropdown-group">
                          <div className="search-dropdown-group-header">
                            <Dumbbell size={13} />
                            <span>Exercícios</span>
                          </div>
                          {searchResults.matchingExercises.map((exercise) => (
                            <button
                              key={exercise.id || exercise.name}
                              type="button"
                              className="search-dropdown-item"
                              onClick={() => handleSelectExercise(exercise)}
                            >
                              <span className="search-dropdown-icon">
                                <Dumbbell size={14} />
                              </span>
                              <div className="search-dropdown-info">
                                <strong>{exercise.name}</strong>
                                <small>
                                  {exercise.muscleGroup}
                                  {exercise.equipment ? ` · ${exercise.equipment}` : ''}
                                </small>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="search-dropdown-empty">
                      Nenhum resultado para "{searchQuery}"
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : (
            <div className="app-header__spacer" />
          )}

          <div className="app-header__user-wrapper" ref={userMenuRef}>
            <button
              type="button"
              className="app-header__user-btn"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <div className="app-header__avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name || 'Avatar'} className="app-header__avatar-img" />
                ) : (
                  <span className="app-header__avatar-fallback">{getInitials(user.name)}</span>
                )}
              </div>

              <div className="app-header__user-info">
                <span className="app-header__user-name">{user.name}</span>
                <span className="app-header__user-role">{roleLabel}</span>
              </div>

              <ChevronDown
                size={16}
                className={`app-header__user-caret ${isUserMenuOpen ? 'app-header__user-caret--open' : ''}`}
                aria-hidden="true"
              />
            </button>

            {isUserMenuOpen && (
              <div className="app-header__dropdown" role="menu">
                <button
                  type="button"
                  className="app-header__dropdown-item"
                  role="menuitem"
                  onClick={handleNavigateToProfile}
                >
                  <User size={16} aria-hidden="true" />
                  <span>Ver o meu perfil</span>
                </button>
                <div className="app-header__dropdown-divider" />
                <button
                  type="button"
                  className="app-header__dropdown-item app-header__dropdown-item--danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="app-shell__content">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default AppLayout
