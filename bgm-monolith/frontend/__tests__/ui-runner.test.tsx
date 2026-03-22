import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '../src/test-utils/render'
import userEvent from '@testing-library/user-event'
import { loadCases } from '../src/test-utils/loadCases'
import PanelContainer from '../src/pages/nl-analysis/components/PanelContainer'
import ConversationHistory from '../src/pages/nl-analysis/components/panel-a/ConversationHistory'
import { usePanelStore } from '../src/pages/nl-analysis/stores/panelStore'
import { useChatStore } from '../src/pages/nl-analysis/stores/chatStore'

const panelCases = loadCases('ui/nl-analysis/panel-layout.cases.yaml')
const histCases = loadCases('ui/nl-analysis/conversation-history.cases.yaml')

function resetStores(tc: any) {
  usePanelStore.setState({
    panelA: { visible: false, width: 240 },
    panelB: { visible: true, width: 600 },
    panelC: { visible: false, width: 400 },
    panelD: { visible: false, width: 240 },
  })
  useChatStore.setState({
    conversations: [],
    currentConversationId: null,
    isLoading: false,
  })

  if (tc.setup?.store_state) {
    const ss = tc.setup.store_state
    if (ss.panelA || ss.panelB || ss.panelC || ss.panelD) {
      const cur = usePanelStore.getState()
      const patch: any = {}
      for (const k of ['panelA', 'panelB', 'panelC', 'panelD'] as const) {
        if (ss[k]) patch[k] = { ...cur[k], ...ss[k] }
      }
      usePanelStore.setState(patch)
    }
    if (Array.isArray(ss.conversations)) {
      useChatStore.setState({ conversations: ss.conversations })
    }
  }
}

async function runAction(tc: any, user: ReturnType<typeof userEvent.setup>) {
  if (!tc.action || tc.action === 'render_page') return
  const { type, target, value } = tc.action
  if (type === 'click') {
    const el = screen.getByTestId(target)
    await user.click(el)
  } else if (type === 'fill') {
    const el = screen.getByTestId(target)
    await user.clear(el)
    await user.type(el, value)
  }
}

function assertExpected(expected: any[]) {
  for (const exp of expected) {
    const testId = exp.selector.replace('[data-testid=', '').replace(']', '').replace(/"/g, '')
    if (exp.visible === true) {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    } else if (exp.visible === false) {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
    }
    if (exp.text) {
      expect(screen.getByTestId(testId)).toHaveTextContent(exp.text)
    }
  }
}

describe.each(panelCases)('$id: $name', (tc: any) => {
  beforeEach(() => resetStores(tc))
  it('passes', async () => {
    const user = userEvent.setup()
    render(<PanelContainer />)
    await runAction(tc, user)
    assertExpected(tc.expected)
  })
})

describe.each(histCases)('$id: $name', (tc: any) => {
  beforeEach(() => resetStores(tc))
  it('passes', async () => {
    const user = userEvent.setup()
    render(<ConversationHistory />)
    await runAction(tc, user)
    assertExpected(tc.expected)
  })
})
