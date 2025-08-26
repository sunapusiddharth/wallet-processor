// store/modalStore.ts
import { create } from 'zustand'

type ModalState = {
  isOpen: boolean
  component: React.ReactNode | null
  openModal: (component: React.ReactNode) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  component: null,
  openModal: (component) => set({ isOpen: true, component }),
  closeModal: () => set({ isOpen: false, component: null }),
}))
