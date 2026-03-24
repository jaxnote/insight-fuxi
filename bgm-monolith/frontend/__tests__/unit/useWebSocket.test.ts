import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { useWebSocket } from '../../src/hooks/useWebSocket'

describe('useWebSocket', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── 已有回归测试 ──────────────────────────────────────────────────────────
  it('send() 在 url=null 时应抛出错误而不静默丢消息', () => {
    const { result } = renderHook(() => useWebSocket(null))
    expect(() => result.current.send({ type: 'query', content: 'test' })).toThrow(
      /not connected/i
    )
  })

  it('send() 在 WebSocket readyState CLOSED 时应抛出错误', () => {
    const mockWs = {
      readyState: 3, // CLOSED
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onopen: null as unknown,
      onclose: null as unknown,
      onerror: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const { result } = renderHook(() => useWebSocket('ws://test'))
    expect(() => result.current.send({ type: 'query' })).toThrow(/not connected/i)
  })

  // ── 测试缺口补全：CONNECTING 状态 ─────────────────────────────────────────
  it('send() 在 WebSocket CONNECTING 状态时应抛出错误且不调用底层 send', () => {
    const mockWs = {
      readyState: 0, // CONNECTING
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onopen: null as unknown,
      onclose: null as unknown,
      onerror: null as unknown,
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const { result } = renderHook(() => useWebSocket('ws://test'))
    expect(() => result.current.send({ type: 'query' })).toThrow(/not connected/i)
    expect(mockWs.send).not.toHaveBeenCalled()
  })

  // ── N1: options 回调更新后应调用最新回调（陈旧闭包修复验证）───────────────
  it('onMessage 更新后应调用最新的回调而不是旧的回调', () => {
    let capturedOnMessage: ((e: MessageEvent) => void) | null = null
    const mockWs = {
      readyState: 1, // OPEN
      send: vi.fn(),
      close: vi.fn(),
      onmessage: null as unknown,
      onopen: null as unknown,
      onclose: null as unknown,
      onerror: null as unknown,
      set onmessage(fn: unknown) { capturedOnMessage = fn as (e: MessageEvent) => void },
      get onmessage() { return capturedOnMessage as unknown },
    }
    vi.stubGlobal('WebSocket', vi.fn().mockReturnValue(mockWs))

    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { rerender } = renderHook(
      ({ onMessage }: { onMessage: typeof firstCallback }) =>
        useWebSocket('ws://test', { onMessage }),
      { initialProps: { onMessage: firstCallback } },
    )

    // 更新回调（url 不变，不触发 effect 重跑）
    rerender({ onMessage: secondCallback })

    // 模拟收到 WS 消息
    act(() => {
      capturedOnMessage?.({
        data: JSON.stringify({ type: 'result', content: 'hello' }),
      } as MessageEvent)
    })

    // 修复前：firstCallback 会被调用（陈旧闭包）
    // 修复后：secondCallback 被调用
    expect(secondCallback).toHaveBeenCalledTimes(1)
    expect(firstCallback).not.toHaveBeenCalled()
  })
})
