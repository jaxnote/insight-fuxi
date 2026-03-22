import { useEditorStore } from '../../stores/editorStore'
import TabBar from './TabBar'

export default function EditorPreview() {
  const { tabs, activeTabId } = useEditorStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  return (
    <div data-testid="editor-preview" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {tabs.length === 0 ? (
        <div data-testid="editor-empty-state" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 14 }}>
          No files open
        </div>
      ) : (
        <>
          <TabBar />
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', fontSize: 14, color: '#e0e0e0' }}>
            <pre>{activeTab?.content}</pre>
          </div>
        </>
      )}
    </div>
  )
}
