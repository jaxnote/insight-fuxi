export function buildConversation(overrides: Record<string, unknown> = {}) {
  return {
    id: crypto.randomUUID(),
    title: '测试会话',
    folder: null,
    pinned: 0,
    model_name: 'gpt-4o',
    mode: 'agent' as const,
    token_used: 0,
    token_limit: 128000,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

export function buildMessage(overrides: Record<string, unknown> = {}) {
  return {
    id: crypto.randomUUID(),
    role: 'user' as const,
    content_type: 'text' as const,
    content: '上月GMV为什么下降',
    metadata: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}
