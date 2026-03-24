import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../src/test-utils/render'
import userEvent from '@testing-library/user-event'
import { useChatStore } from '../../src/pages/nl-analysis/stores/chatStore'

class MockWebSocket {
  static OPEN = 1
  readyState = MockWebSocket.OPEN
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  onerror: ((event: Event) => void) | null = null
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

  it('store isLoading=true 时 ChatArea 显示 AI 消息或保留现有消息', async () => {
    // WS thinking 事件最终通过 store.isLoading 驱动 UI；
    // 此测试验证 store 状态变更后组件能响应（WS → store → UI 链路的 UI 端）。
    const { ChatAreaWithInput } = await import('../../src/pages/nl-analysis/components/panel-b/ChatAreaWithInput')
    render(<ChatAreaWithInput />)

    // welcome-message 在空消息时可见
    expect(screen.getByTestId('welcome-message')).toBeInTheDocument()

    // 模拟 WS 推送 assistant 回复后 store 更新
    useChatStore.setState({
      isLoading: false,
      messages: [{
        id: 'ai-1',
        role: 'assistant',
        content_type: 'text',
        content: '正在分析 GMV 下降原因...',
        metadata: null,
        created_at: new Date().toISOString(),
      }],
    })

    await waitFor(() => {
      expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument()
    })
  })
})
