import { useEditorStore } from '../../stores/editorStore'

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore()
  return (
    <div data-testid="tab-bar" style={{ display: 'flex', background: '#161629', borderBottom: '1px solid #2a2a3e', overflowX: 'auto' }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          data-testid={`tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          style={{ padding: '6px 16px', cursor: 'pointer', fontSize: 12, color: tab.id === activeTabId ? '#fff' : '#888', borderBottom: tab.id === activeTabId ? '2px solid #6a6aae' : '2px solid transparent', display: 'flex', gap: 8, alignItems: 'center' }}
        >
          {tab.name}
          <span onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }} style={{ color: '#666' }}>×</span>
        </div>
      ))}
    </div>
  )
}
