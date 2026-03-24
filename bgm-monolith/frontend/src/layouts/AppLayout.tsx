import { Outlet, NavLink } from 'react-router-dom'
import { usePanelStore } from '../pages/nl-analysis/stores/panelStore'

export default function AppLayout() {
  const { panelA, panelC, panelD, togglePanel } = usePanelStore()

  return (
    <div className="app" data-testid="app-layout">
      <div className="top-bar">
        <div className="dot dot-r" /><div className="dot dot-y" /><div className="dot dot-g" />
        <div className="top-title">insight-fuxi · 自然语言分析</div>
        <div className="top-actions">
          <button
            className={`top-btn${panelA.visible ? ' active' : ''}`}
            title="会话历史"
            onClick={() => togglePanel('panelA')}
          >💬</button>
          <button
            className={`top-btn${panelC.visible ? ' active' : ''}`}
            title="编辑器"
            onClick={() => togglePanel('panelC')}
          >📝</button>
          <button
            className={`top-btn${panelD.visible ? ' active' : ''}`}
            title="文件树"
            onClick={() => togglePanel('panelD')}
          >📁</button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
