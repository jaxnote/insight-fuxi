import { usePanelStore } from '../stores/panelStore'
import ConversationHistory from './panel-a/ConversationHistory'

export default function PanelContainer() {
  const { panelA, panelB, panelC, panelD, togglePanel } = usePanelStore()

  return (
    <div
      data-testid="panel-container"
      style={{ display: 'flex', height: '100%', background: '#0f0f1a', color: '#e0e0e0', position: 'relative' }}
    >
      <button
        data-testid="toggle-panel-a"
        onClick={() => togglePanel('panelA')}
        style={{ position: 'absolute', top: 8, left: 8, zIndex: 10, background: 'transparent', border: '1px solid #444', color: '#ccc', cursor: 'pointer', borderRadius: 4, padding: '4px 8px' }}
        title="Toggle Conversation History"
      >
        A
      </button>

      <button
        data-testid="toggle-panel-d"
        onClick={() => togglePanel('panelD')}
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'transparent', border: '1px solid #444', color: '#ccc', cursor: 'pointer', borderRadius: 4, padding: '4px 8px' }}
        title="Toggle File Tree"
      >
        D
      </button>

      {panelA.visible && (
        <div
          data-testid="panel-a"
          style={{ width: panelA.width, background: '#161629', borderRight: '1px solid #2a2a3e', paddingTop: 40, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <ConversationHistory />
        </div>
      )}

      {panelB.visible && (
        <div
          data-testid="panel-b"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 16px 16px' }}
        >
          <div style={{ flex: 1 }}>Chat Area</div>
        </div>
      )}

      {panelC.visible && (
        <div
          data-testid="panel-c"
          style={{ width: panelC.width, background: '#161629', borderLeft: '1px solid #2a2a3e', padding: 8 }}
        >
          <h3 style={{ fontSize: 12, color: '#888' }}>Editor / Preview</h3>
        </div>
      )}

      {panelD.visible && (
        <div
          data-testid="panel-d"
          style={{ width: panelD.width, background: '#161629', borderLeft: '1px solid #2a2a3e', padding: 8, paddingTop: 40 }}
        >
          <div data-testid="project-selector" style={{ marginBottom: 8 }}>
            <select style={{ width: '100%', background: '#1e1e3a', color: '#ccc', border: '1px solid #444', borderRadius: 4, padding: 4 }}>
              <option>Select Project...</option>
            </select>
          </div>
          <h3 style={{ fontSize: 12, color: '#888' }}>File Tree</h3>
        </div>
      )}
    </div>
  )
}
