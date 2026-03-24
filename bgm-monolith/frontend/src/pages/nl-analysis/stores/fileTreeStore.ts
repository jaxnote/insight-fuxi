import { create } from 'zustand'

interface FileItem { path: string }

interface FileTreeStoreState {
  files: FileItem[]
  selectedProjectId: string | null
  setFiles: (files: FileItem[]) => void
  setSelectedProject: (id: string | null) => void
}

export const useFileTreeStore = create<FileTreeStoreState>((set) => ({
  files: [],
  selectedProjectId: null,
  setFiles: (files) => set({ files }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),
}))
