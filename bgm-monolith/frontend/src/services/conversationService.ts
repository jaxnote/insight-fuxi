import { apiFetch } from './api'
import type { Conversation, Message } from './types'

export const conversationService = {
  list: (q?: string) =>
    apiFetch<{ items: Conversation[]; total: number }>(`/api/nl-analysis/conversations${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  create: (title: string) =>
    apiFetch<Conversation>('/api/nl-analysis/conversations', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id: string, data: Partial<Pick<Conversation, 'title' | 'folder' | 'pinned'>>) =>
    apiFetch<Conversation>(`/api/nl-analysis/conversations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/nl-analysis/conversations/${id}`, { method: 'DELETE' }),
  getMessages: (convId: string) =>
    apiFetch<{ items: Message[] }>(`/api/nl-analysis/conversations/${convId}/messages`),
}
