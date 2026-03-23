import { create } from 'zustand'

interface Tab {
  id: string
  name: string
  type: 'sql' | 'markdown' | 'table' | 'chart'
  content: string
  isEditing?: boolean
}

interface EditorStoreState {
  tabs: Tab[]
  activeTabId: string | null
  addTab: (tab: Tab) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (tab) => set((s) => ({ tabs: [...s.tabs, tab], activeTabId: tab.id })),
  closeTab: (id) => set((s) => {
    const tabs = s.tabs.filter((t) => t.id !== id)
    return { tabs, activeTabId: tabs[0]?.id ?? null }
  }),
  setActiveTab: (id) => set({ activeTabId: id }),
}))
