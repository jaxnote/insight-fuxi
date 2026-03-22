import { create } from 'zustand'

export const useChatStore = create(() => ({
  messages: [] as any[],
  isLoading: false,
}))
