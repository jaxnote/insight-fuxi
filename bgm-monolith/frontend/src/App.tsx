import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import NLAnalysisPage from './pages/nl-analysis'
import SettingsPage from './pages/settings'
import ModelMgmtPage from './pages/model-mgmt'
import ProjectMgmtPage from './pages/project-mgmt'
import LoginPage from './pages/login'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/nl-analysis" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/nl-analysis" element={<NLAnalysisPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/model-mgmt" element={<ModelMgmtPage />} />
        <Route path="/project-mgmt" element={<ProjectMgmtPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
