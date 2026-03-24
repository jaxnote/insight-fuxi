import { create } from 'zustand'

interface PanelState {
  visible: boolean
  width: number
}

interface PanelStoreState {
  panelA: PanelState
  panelB: PanelState
  panelC: PanelState
  panelD: PanelState
  togglePanel: (panel: 'panelA' | 'panelB' | 'panelC' | 'panelD') => void
  setPanelWidth: (panel: 'panelA' | 'panelB' | 'panelC' | 'panelD', width: number) => void
}

export const usePanelStore = create<PanelStoreState>((set) => ({
  panelA: { visible: false, width: 240 },
  panelB: { visible: true, width: 600 },
  panelC: { visible: false, width: 400 },
  panelD: { visible: false, width: 240 },
  togglePanel: (panel) =>
    set((state) => ({
      [panel]: { ...state[panel], visible: !state[panel].visible },
    })),
  setPanelWidth: (panel, width) =>
    set((state) => ({
      [panel]: { ...state[panel], width },
    })),
}))
