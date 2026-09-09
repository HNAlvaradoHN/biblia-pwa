import { NavLink, Outlet } from 'react-router'
import { UpdatePrompt } from '../pwa/UpdatePrompt'

const navItems = [
  { to: '/', label: 'Inicio', icon: '⌂', end: true },
  { to: '/biblia', label: 'Biblia', icon: '▤' },
  { to: '/predicas', label: 'Prédicas', icon: '✎' },
  { to: '/buscar', label: 'Buscar', icon: '⌕' },
]

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

      <nav className="bottom-nav" aria-label="Navegación principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </nav>

      <UpdatePrompt />
    </div>
  )
}
