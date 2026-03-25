import { Outlet } from 'react-router-dom'
import GlobalNav from '../components/GlobalNav'

export default function AppLayout() {
  return (
    <div className="app" data-testid="app-layout">
      <GlobalNav />
      <Outlet />
    </div>
  )
}
