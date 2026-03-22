import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div data-testid="app-layout" style={{ display: 'flex', height: '100vh' }}>
      <nav data-testid="sidebar" style={{ width: 200, background: '#1a1a2e', color: '#fff', padding: 16 }}>
        <h2 style={{ fontSize: 14, marginBottom: 16 }}>Insight Fuxi</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/nl-analysis" style={{ color: '#fff', textDecoration: 'none' }}>NL Analysis</a></li>
          <li><a href="/settings" style={{ color: '#fff', textDecoration: 'none' }}>Settings</a></li>
        </ul>
      </nav>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
