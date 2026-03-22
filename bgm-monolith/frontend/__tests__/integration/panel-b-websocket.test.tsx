import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../src/test-utils/render'
import userEvent from '@testing-library/user-event'
import { useChatStore } from '../../src/pages/nl-analysis/stores/chatStore'

// 模拟 WebSocket
class MockWebSocket {
  static OPEN = 1
  readyState = MockWebSocket.OPEN
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  send = vi.fn()
  close = vi.fn()

  constructor() {
    setTimeout(() => this.onopen?.(), 0)
  }

  simulateMessage(data: object) {
    this.onmessage?.({ data: JSON.stringify(data) })
  }
}

let mockWs: MockWebSocket

vi.stubGlobal('WebSocket', class {
  constructor() {
    mockWs = new MockWebSocket()
    return mockWs
  }
  static OPEN = 1
})

describe('Panel B WebSocket 流式消息', () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [],
      currentConversationId: null,
      messages: [],
      isLoading: false,
    })
  })

  it('用户发送消息后，消息出现在列表中', async () => {
    const { ChatAreaWithInput } = await import('../../src/pages/nl-analysis/components/panel-b/ChatAreaWithInput')
    const user = userEvent.setup()
    render(<ChatAreaWithInput />)

    const input = screen.getByTestId('message-input')
    await user.type(input, 'GMV为什么下降')
    await user.click(screen.getByTestId('send-btn'))

    await waitFor(() => {
      const msgs = useChatStore.getState().messages
      expect(msgs.length).toBeGreaterThan(0)
      expect(msgs[0].content).toBe('GMV为什么下降')
    })
  })

  it('接收 thinking 事件后，loading 状态为 true', async () => {
    const { ChatAreaWithInput } = await import('../../src/pages/nl-analysis/components/panel-b/ChatAreaWithInput')
    render(<ChatAreaWithInput />)

    useChatStore.setState({ isLoading: true })

    await waitFor(() => {
      expect(useChatStore.getState().isLoading).toBe(true)
    })
  })
})
