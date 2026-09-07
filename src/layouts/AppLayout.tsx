import { Navigate, NavLink, Outlet, useNavigate } from 'react-router'
import { logout } from '../auth/api'
import { useAuth } from '../auth/useAuth'
import { ALUNO_MENU_ITEMS, PERSONAL_MENU_ITEMS } from '../navigation/menuItems'
import './AppLayout.css'

function AppLayout() {
  const { user, clearUser } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const menuItems = user.role === 'personal' ? PERSONAL_MENU_ITEMS : ALUNO_MENU_ITEMS

  async function handleLogout() {
    await logout()
    clearUser()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <span className="app-sidebar__logo" aria-hidden="true" />
          <span>FITFORGE</span>
        </div>

        <p className="app-sidebar__role">
          {user.role === 'personal' ? 'Personal Trainer' : 'Aluno'}
        </p>

        <nav aria-label="Navegação principal" className="app-sidebar__nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="app-sidebar__logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <section className="app-shell__content">
        <Outlet />
      </section>
    </div>
  )
}

export default AppLayout
