import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import NLAnalysisPage from './pages/nl-analysis'
import SettingsPage from './pages/settings'
import ModelMgmtPage from './pages/model-mgmt'
import ProjectMgmtPage from './pages/project-mgmt'
import LoginPage from './pages/login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/nl-analysis" replace />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/nl-analysis', element: <NLAnalysisPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/model-mgmt', element: <ModelMgmtPage /> },
      { path: '/project-mgmt', element: <ProjectMgmtPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])
