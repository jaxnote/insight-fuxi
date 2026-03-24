import { describe, it, expect, vi, afterEach } from 'vitest'

// ── I5: apiFetch 对 204 No Content 不应调 res.json() ────────────────────────
describe('apiFetch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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
})
