import { create } from 'zustand'
import type { Conversation, Message } from '../../../../services/types'

interface ChatStoreState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  messages: Message[]
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (msg: Message) => void
}

export const useChatStore = create<ChatStoreState>((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  messages: [],
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
}))
