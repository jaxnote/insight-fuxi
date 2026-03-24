import { Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../../components/PlaceholderPage'

export default function ControlModule() {
  return (
    <Routes>
      <Route path="teams" element={<PlaceholderPage title="智能体团队" />} />
      <Route path="scheduling" element={<PlaceholderPage title="调度流程" />} />
      <Route path="monitoring" element={<PlaceholderPage title="调度监控" />} />
      <Route path="insights" element={<PlaceholderPage title="洞察推送" />} />
      <Route index element={<Navigate to="teams" replace />} />
    </Routes>
  )
}
