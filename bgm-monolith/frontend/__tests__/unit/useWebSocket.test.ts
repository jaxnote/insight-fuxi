import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import { useWebSocket } from '../../src/hooks/useWebSocket'

// ── C1: useWebSocket.send() 未连接时应抛错而非静默丢消息 ─────────────────────
describe('useWebSocket', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('send() 在 url=null 时应抛出错误而不静默丢消息', () => {
    const { result } = renderHook(() => useWebSocket(null))
    expect(() => result.current.send({ type: 'query', content: 'test' })).toThrow(
      /not connected|未连接/i
    )
  })

  it('send() 在 WebSocket readyState 非 OPEN 时应抛出错误', () => {
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
    expect(() => result.current.send({ type: 'query' })).toThrow(/not connected|未连接/i)
  })
})
