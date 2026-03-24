import { Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../../components/PlaceholderPage'

export default function SettingsModule() {
  return (
    <Routes>
      <Route path="memory" element={<PlaceholderPage title="记忆管理" />} />
      <Route path="knowledge" element={<PlaceholderPage title="知识库管理" />} />
      <Route path="channels" element={<PlaceholderPage title="频道管理" />} />
      <Route path="users" element={<PlaceholderPage title="用户管理" />} />
      <Route index element={<Navigate to="memory" replace />} />
      <Route path="*" element={<Navigate to="memory" replace />} />
    </Routes>
  )
}
