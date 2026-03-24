import { describe, it, expect, vi } from 'vitest'
import { WebSocketClient } from '../../src/services/wsClient'

// ── C2: wsClient.send() 在未连接时应抛错而非静默丢消息 ──────────────────────
describe('WebSocketClient', () => {
  it('send() 在未连接时应抛出错误而不静默失败', () => {
    const client = new WebSocketClient()
    // 未调用 connect()，ws 为 null
    expect(() => client.send({ type: 'query', content: 'test' })).toThrowError(
      /not connected/i
    )
  })

  it('send() 在连接已关闭时应抛出错误', () => {
    const mockWs = {
      readyState: 3, // CLOSED
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    client.connect('ws://test', vi.fn())
    expect(() => client.send({ type: 'query' })).toThrowError(/not connected/i)
    expect(mockWs.send).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})
