import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen } from '../../src/test-utils/render'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useChatStore } from '../../src/pages/nl-analysis/stores/chatStore'
import { useEditorStore } from '../../src/pages/nl-analysis/stores/editorStore'
import PanelContainer from '../../src/pages/nl-analysis/components/PanelContainer'
import { usePanelStore } from '../../src/pages/nl-analysis/stores/panelStore'

const server = setupServer(
  http.get('/api/nl-analysis/conversations', () => {
    return HttpResponse.json({
      items: [{ id: 'c1', title: 'GMV分析', folder: null, pinned: 0, model_name: 'gpt-4o', mode: 'agent', token_used: 0, token_limit: 128000, created_at: '2026-01-01' }],
      total: 1
    })
  }),
  http.get('/api/projects', () => {
    return HttpResponse.json({ items: [], total: 0 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('NL Analysis 页面联调', () => {
  beforeEach(() => {
    useChatStore.setState({ conversations: [], currentConversationId: null, messages: [], isLoading: false })
    useEditorStore.setState({ tabs: [], activeTabId: null })
    usePanelStore.setState({
      panelA: { visible: true, width: 240 },
      panelB: { visible: true, width: 600 },
      panelC: { visible: false, width: 400 },
      panelD: { visible: false, width: 240 },
    })
  })

  it('Panel B 默认可见，Panel A 展开后可见', () => {
    render(<PanelContainer />)
    expect(screen.getByTestId('panel-b')).toBeInTheDocument()
    expect(screen.getByTestId('panel-a')).toBeInTheDocument()
  })

  it('Panel C 展开后 EditorPreview 可见', () => {
    usePanelStore.setState((s) => ({ ...s, panelC: { ...s.panelC, visible: true } }))
    render(<PanelContainer />)
    expect(screen.getByTestId('editor-preview')).toBeInTheDocument()
  })

  it('Panel D 展开后文件树可见', () => {
    usePanelStore.setState((s) => ({ ...s, panelD: { ...s.panelD, visible: true } }))
    render(<PanelContainer />)
    expect(screen.getByTestId('file-tree')).toBeInTheDocument()
  })
})
