import { useRef, useCallback } from 'react'
import { MessageSquare, FolderTree } from 'lucide-react'
import { usePanelStore } from '../stores/panelStore'
import ConversationHistory from './panel-a/ConversationHistory'
import PanelBContent from './panel-b/PanelBContent'
import EditorPreview from './panel-c/EditorPreview'
import PanelDContent from './panel-d/PanelDContent'

export default function PanelContainer() {
  const { panelA, panelC, panelD, setPanelWidth, togglePanel } = usePanelStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const startSingleResize = useCallback((
    e: React.MouseEvent,
    panelKey: 'panelA' | 'panelC',
    currentWidth: number,
    direction: 1 | -1,
  ) => {
    e.preventDefault()
    const startX = e.clientX
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      setPanelWidth(panelKey, Math.max(180, currentWidth + dx * direction))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [setPanelWidth])

  const startDualResize = useCallback((
    e: React.MouseEvent,
    leftKey: 'panelC',
    leftW: number,
    rightKey: 'panelD',
    rightW: number,
  ) => {
    e.preventDefault()
    const startX = e.clientX
    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      setPanelWidth(leftKey, Math.max(180, leftW + dx))
      setPanelWidth(rightKey, Math.max(180, rightW - dx))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [setPanelWidth])

  return (
    <div className="main-body" ref={containerRef}>
      {!panelA.visible ? (
        <div className="panel-collapsed-bar">
          <button
            data-testid="collapsed-panel-a"
            className="pcb-btn"
            onClick={() => togglePanel('panelA')}
            title="展开会话历史"
          >
            <MessageSquare size={15} />
          </button>
        </div>
      ) : null}

      {/* Panel A */}
      {panelA.visible && (
        <div
          className="panel panel-a"
          data-testid="panel-a"
          style={{ width: panelA.width }}
        >
          <ConversationHistory />
        </div>
      )}

      {panelA.visible && (
        <div
          className="resize-handle"
          onMouseDown={(e) => startSingleResize(e, 'panelA', panelA.width, 1)}
        />
      )}

      {/* Panel B (always visible) */}
      <div className="panel panel-b" data-testid="panel-b">
        <PanelBContent />
      </div>

      {panelC.visible && (
        <div
          className="resize-handle"
          onMouseDown={(e) => startSingleResize(e, 'panelC', panelC.width, -1)}
        />
      )}

      {/* Panel C */}
      {panelC.visible && (
        <div
          className="panel panel-c"
          data-testid="panel-c"
          style={{ width: panelC.width }}
        >
          <EditorPreview />
        </div>
      )}

      {panelC.visible && panelD.visible && (
        <div
          className="resize-handle"
          onMouseDown={(e) => startDualResize(e, 'panelC', panelC.width, 'panelD', panelD.width)}
        />
      )}

      {/* Panel D */}
      {panelD.visible && (
        <div
          className="panel panel-d"
          data-testid="panel-d"
          style={{ width: panelD.width }}
        >
          <PanelDContent />
        </div>
      )}

      {!panelD.visible ? (
        <div className="panel-collapsed-bar right-bar">
          <button
            data-testid="collapsed-panel-d"
            className="pcb-btn"
            onClick={() => togglePanel('panelD')}
            title="展开文件树"
          >
            <FolderTree size={15} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
