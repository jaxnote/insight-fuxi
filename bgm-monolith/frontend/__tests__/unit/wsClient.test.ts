import { describe, it, expect, vi, afterEach } from 'vitest'
import { WebSocketClient } from '../../src/services/wsClient'

describe('WebSocketClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── 已有回归测试（C2 send 静默丢消息）────────────────────────────────────
  it('send() 在未连接时应抛出错误而不静默失败', () => {
    const client = new WebSocketClient()
    expect(() => client.send({ type: 'query', content: 'test' })).toThrowError(
      /not connected/i
    )
  })

  it('send() 在连接已关闭时应抛出错误', () => {
    const mockWs = {
      readyState: 3, // CLOSED
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown,
      onclose: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    client.connect('ws://test', vi.fn())
    expect(() => client.send({ type: 'query' })).toThrowError(/not connected/i)
    expect(mockWs.send).not.toHaveBeenCalled()
  })

  // ── C2-New: connect() 应注册 onerror/onclose 回调 ────────────────────────
  it('connect() 应在 WebSocket 出错时触发 onError 回调', () => {
    const mockWs = {
      readyState: WebSocket.CONNECTING,
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown as ((e: Event) => void) | null,
      onclose: null as unknown,
      onopen: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    const onError = vi.fn()
    client.connect('ws://test', vi.fn(), onError)

    // 模拟 WebSocket 错误事件
    expect(mockWs.onerror).toBeDefined()
    mockWs.onerror!(new Event('error'))
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('connect() 应在 WebSocket 关闭时触发 onClose 回调', () => {
    const mockWs = {
      readyState: WebSocket.CONNECTING,
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown,
      onclose: null as unknown as ((e: CloseEvent) => void) | null,
      onopen: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    const onClose = vi.fn()
    client.connect('ws://test', vi.fn(), undefined, onClose)

    expect(mockWs.onclose).toBeDefined()
    mockWs.onclose!(new CloseEvent('close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
