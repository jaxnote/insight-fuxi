import { create } from 'zustand'
import type { Conversation, Message, Folder } from '../../../services/types'

interface ChatStoreState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  messages: Message[]
  folders: Folder[]
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (msg: Message) => void
  togglePin: (id: string) => void
  renameConversation: (id: string, title: string) => void
  reorderConversation: (activeId: string, overId: string) => void
  moveToFolder: (convId: string, folderId: string) => void
  removeFromFolder: (convId: string) => void
  createFolderFromMerge: (dragId: string, dropId: string) => void
}

export const useChatStore = create<ChatStoreState>((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  messages: [],
  folders: [],
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  togglePin: (id) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === id ? { ...c, pinned: c.pinned ? 0 : 1 } : c
    )
  })),
  renameConversation: (id, title) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === id ? { ...c, title } : c
    )
  })),

  reorderConversation: (activeId, overId) => set((s) => {
    const list = [...s.conversations]
    const fromIdx = list.findIndex(c => c.id === activeId)
    const toIdx = list.findIndex(c => c.id === overId)
    if (fromIdx === -1 || toIdx === -1) return s
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    return { conversations: list.map((c, i) => ({ ...c, order: i })) }
  }),

  moveToFolder: (convId, folderId) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === convId ? { ...c, folderId } : c
    )
  })),

  removeFromFolder: (convId) => set((s) => ({
    conversations: s.conversations.map(c =>
      c.id === convId ? { ...c, folderId: null } : c
    )
  })),

  createFolderFromMerge: (dragId, dropId) => set((s) => {
    const dragConv = s.conversations.find(c => c.id === dragId)
    const dropConv = s.conversations.find(c => c.id === dropId)
    if (!dragConv || !dropConv) return s
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: `${dropConv.title} +1`,
      order: s.folders.length,
    }
    return {
      folders: [...s.folders, newFolder],
      conversations: s.conversations.map(c =>
        c.id === dragId || c.id === dropId ? { ...c, folderId: newFolder.id } : c
      ),
    }
  }),
}))
