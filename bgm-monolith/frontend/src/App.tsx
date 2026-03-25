import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import NLAnalysisPage from './pages/nl-analysis'
import PluginsModule from './pages/plugins'
import ProjectsPage from './pages/projects'
import DashboardModule from './pages/dashboard'
import ControlModule from './pages/control'
import SettingsModule from './pages/settings'
import LoginPage from './pages/login'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/nl-analysis" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/nl-analysis" element={<NLAnalysisPage />} />
        <Route path="/plugins/*" element={<PluginsModule />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/*" element={<DashboardModule />} />
        <Route path="/control/*" element={<ControlModule />} />
        <Route path="/settings/*" element={<SettingsModule />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
