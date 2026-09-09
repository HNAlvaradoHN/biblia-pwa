import { NavLink, Outlet } from 'react-router'
import { UpdatePrompt } from '../pwa/UpdatePrompt'

type NavIconName = 'home' | 'bible' | 'sermon' | 'search'

const navItems: Array<{ to: string; label: string; icon: NavIconName; end?: boolean }> = [
  { to: '/', label: 'Inicio', icon: 'home', end: true },
  { to: '/biblia', label: 'Biblia', icon: 'bible' },
  { to: '/predicas', label: 'Prédicas', icon: 'sermon' },
  { to: '/buscar', label: 'Buscar', icon: 'search' },
]

function NavIcon({ name }: { name: NavIconName }) {
  if (name === 'home') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m3 10.5 9-7 9 7" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    )
  }

  if (name === 'bible') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4V5.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18a3 3 0 0 1 3-3h4V5.5Z" />
      </svg>
    )
  }

  if (name === 'sermon') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 3h9l3 3v15H6V3Z" />
        <path d="M15 3v4h4" />
        <path d="M9 11h6M9 15h6M9 19h3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="Ir al inicio">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>
            <strong>Biblia</strong>
            <small>Base de prueba</small>
          </span>
        </NavLink>
        <span className="version-badge">v{__APP_VERSION__}</span>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <nav className="bottom-nav glass-dock" aria-label="Navegación principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">
              <NavIcon name={item.icon} />
            </span>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </nav>

      <UpdatePrompt />
    </div>
  )
}
