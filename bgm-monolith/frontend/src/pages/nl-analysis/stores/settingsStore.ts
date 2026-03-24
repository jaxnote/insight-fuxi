import { create } from 'zustand'

export const useSettingsStore = create(() => ({
  model: 'gpt-4o',
  mode: 'agent' as const,
}))
