import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/nl-analysis/conversations', () => {
    return HttpResponse.json({ items: [], total: 0 })
  }),
  http.post('/api/nl-analysis/conversations', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'test-id', title: body['title'], created_at: new Date().toISOString() })
  }),
  http.get('/api/projects', () => {
    return HttpResponse.json({ items: [], total: 0 })
  }),
]
