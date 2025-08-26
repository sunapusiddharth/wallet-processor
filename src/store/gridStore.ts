import { create } from 'zustand'
type PanelLayout = {
  id: string
  x: number
  y: number
  width: number
  height: number
}

type Panel = {
  id: string
  type: string
  props: Record<string, any>
}

type GridState = {
  panels: Panel[]
  layouts: PanelLayout[]
  addPanel: (panel: Panel) => void
  updateLayout: (id: string, layout: Partial<PanelLayout>) => void
  removePanel: (id: string) => void
}

export const useGridStore = create<GridState>((set) => ({
  panels: [],
  layouts: [],
  addPanel: (panel) =>
    set((state) => ({
      panels: [...state.panels, panel],
      layouts: [...state.layouts, {
        id: panel.id,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      }],
    })),
  updateLayout: (id, layout) =>
    set((state) => ({
      layouts: state.layouts.map((l) =>
        l.id === id ? { ...l, ...layout } : l
      ),
    })),
  removePanel: (id) =>
    set((state) => ({
      panels: state.panels.filter((p) => p.id !== id),
      layouts: state.layouts.filter((l) => l.id !== id),
    })),
}))
