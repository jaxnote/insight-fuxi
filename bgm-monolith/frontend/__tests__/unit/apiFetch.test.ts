import { describe, it, expect, vi, afterEach } from 'vitest'

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── 已有回归测试（I5: 204 No Content）───────────────────────────────────
  it('204 响应应返回 undefined 而不抛 JSON 解析错误', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: { get: () => '0' },
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected end of JSON input')),
    }))

    const { apiFetch } = await import('../../src/services/api')
    const result = await apiFetch('/api/nl-analysis/conversations/abc')
    expect(result).toBeUndefined()
  })

  it('非 204 成功响应正常解析 JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => null },
      json: vi.fn().mockResolvedValue({ id: '1', title: 'test' }),
    }))

    const { apiFetch } = await import('../../src/services/api')
    const result = await apiFetch<{ id: string }>('/api/nl-analysis/conversations')
    expect(result).toEqual({ id: '1', title: 'test' })
  })

  // ── I1-New: 自定义 headers 与 Content-Type 应合并而非覆盖 ────────────────
  it('调用方传入 Authorization 时 Content-Type 应被保留', async () => {
    let capturedOptions: RequestInit | undefined
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url: string, opts: RequestInit) => {
      capturedOptions = opts
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: vi.fn().mockResolvedValue({}),
        text: vi.fn().mockResolvedValue('{}'),
      })
    }))

    const { apiFetch } = await import('../../src/services/api')
    await apiFetch('/test', {
      method: 'POST',
      headers: { Authorization: 'Bearer token123' },
    })

    const headers = capturedOptions?.headers as Record<string, string>
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Authorization']).toBe('Bearer token123')
  })

  // ── I6-New: 4xx 响应应将 body detail 包含在错误信息中 ───────────────────
  it('422 响应应将 body 中的 detail 包含在抛出的错误信息中', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      text: vi.fn().mockResolvedValue(JSON.stringify({ detail: '字段验证失败' })),
    }))

    const { apiFetch } = await import('../../src/services/api')
    await expect(apiFetch('/test')).rejects.toThrow('字段验证失败')
  })

  it('4xx 响应在 body 非 JSON 时应包含原始文本', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: vi.fn().mockResolvedValue('Not Found'),
    }))

    const { apiFetch } = await import('../../src/services/api')
    await expect(apiFetch('/test')).rejects.toThrow(/404/)
  })
})
