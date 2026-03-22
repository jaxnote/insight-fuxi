import { create } from 'zustand'
import type { Conversation } from '../../../../services/types'

interface ChatStoreState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (id: string | null) => void
}

export const useChatStore = create<ChatStoreState>((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
}))
