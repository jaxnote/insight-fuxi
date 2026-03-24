import { useRef, useCallback } from 'react'
import { usePanelStore } from '../stores/panelStore'
import ConversationHistory from './panel-a/ConversationHistory'
import PanelBContent from './panel-b/PanelBContent'
import EditorPreview from './panel-c/EditorPreview'
import PanelDContent from './panel-d/PanelDContent'

export default function PanelContainer() {
  const { panelA, panelC, panelD, togglePanel, setPanelWidth } = usePanelStore()
  const containerRef = useRef<HTMLDivElement>(null)

  const startResize = useCallback((
    e: React.MouseEvent,
    leftKey: 'panelA' | 'panelC',
    leftW: number,
    rightKey: 'panelC' | 'panelD',
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
          onMouseDown={(e) => startResize(e, 'panelA', panelA.width, 'panelC', panelC.width)}
        />
      )}

      {/* Panel B (always visible) */}
      <div className="panel panel-b" data-testid="panel-b">
        <PanelBContent />
      </div>

      {panelC.visible && (
        <div
          className="resize-handle"
          onMouseDown={(e) => startResize(e, 'panelC', panelC.width, 'panelD', panelD.width)}
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
          onMouseDown={(e) => startResize(e, 'panelC', panelC.width, 'panelD', panelD.width)}
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

    </div>
  )
}
