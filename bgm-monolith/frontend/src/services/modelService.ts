export interface Model {
  id: string
  name: string
  provider: string
}

export const modelService = {
  list: async (): Promise<Model[]> => {
    return [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    ]
  },
}
