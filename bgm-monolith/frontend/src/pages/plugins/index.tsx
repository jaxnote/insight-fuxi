import { Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../../components/PlaceholderPage'

export default function PluginsModule() {
  return (
    <Routes>
      <Route path="agents" element={<PlaceholderPage title="Agent管理" />} />
      <Route path="skills" element={<PlaceholderPage title="Skills管理" />} />
      <Route path="rules" element={<PlaceholderPage title="Rules管理" />} />
      <Route path="prompts" element={<PlaceholderPage title="Prompt管理" />} />
      <Route path="models" element={<PlaceholderPage title="模型管理" />} />
      <Route path="templates" element={<PlaceholderPage title="模板管理" />} />
      <Route index element={<Navigate to="agents" replace />} />
    </Routes>
  )
}
