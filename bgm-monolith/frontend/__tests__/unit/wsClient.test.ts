import { describe, it, expect, vi, afterEach } from 'vitest'
import { WebSocketClient } from '../../src/services/wsClient'

describe('WebSocketClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── 已有回归测试 ──────────────────────────────────────────────────────────
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

  // ── 测试缺口补全 ──────────────────────────────────────────────────────────

  it('send() 在 OPEN 状态时应调用底层 ws.send 并序列化为 JSON', () => {
    const mockWs = {
      readyState: 1, // WebSocket.OPEN = 1
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown,
      onclose: null as unknown,
    }
    // 必须在 stub 上挂静态常量，否则 wsClient 代码中 WebSocket.OPEN 为 undefined
    const MockWS = Object.assign(vi.fn().mockReturnValue(mockWs), { OPEN: 1, CONNECTING: 0 })
    vi.stubGlobal('WebSocket', MockWS)

    const client = new WebSocketClient()
    client.connect('ws://test', vi.fn())
    client.send({ type: 'query', content: 'hello' })

    expect(mockWs.send).toHaveBeenCalledTimes(1)
    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'query', content: 'hello' })
    )
  })

  // ── N2: 不传 onError/onClose 时不应抛错（有默认兜底）──────────────────────
  it('connect() 不传 onError 时 WebSocket 出错不应抛出未捕获异常', () => {
    const mockWs = {
      readyState: 0, // CONNECTING
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown as ((e: Event) => void) | null,
      onclose: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    client.connect('ws://test', vi.fn()) // 不传 onError

    // 修复后 onerror 应为默认处理函数（非 null），调用时不抛错
    expect(typeof mockWs.onerror).toBe('function')
    expect(() => mockWs.onerror!(new Event('error'))).not.toThrow()
  })

  it('connect() 不传 onClose 时 WebSocket 关闭不应抛出未捕获异常', () => {
    const mockWs = {
      readyState: 0, // CONNECTING
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onerror: null as unknown,
      onclose: null as unknown as ((e: CloseEvent) => void) | null,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const client = new WebSocketClient()
    client.connect('ws://test', vi.fn()) // 不传 onClose

    expect(typeof mockWs.onclose).toBe('function')
    expect(() => mockWs.onclose!(new CloseEvent('close'))).not.toThrow()
  })
})
