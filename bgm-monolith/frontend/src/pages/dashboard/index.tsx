import { Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../../components/PlaceholderPage'

export default function DashboardModule() {
  return (
    <Routes>
      <Route path="progress" element={<PlaceholderPage title="进度管理" />} />
      <Route path="cost" element={<PlaceholderPage title="成本管理" />} />
      <Route path="performance" element={<PlaceholderPage title="绩效管理" />} />
      <Route index element={<Navigate to="progress" replace />} />
      <Route path="*" element={<Navigate to="progress" replace />} />
    </Routes>
  )
}
