import { create } from 'zustand'

interface DashboardState {
  isDashboardOpen: boolean;
  toggleDashboard: () => void;
}

interface ModalUserState {
  isModalUserOpen: boolean;
  toggleModalUser: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isDashboardOpen: false,
  toggleDashboard: () =>
    set((state) => ({
      isDashboardOpen: !state.isDashboardOpen
    }))
}))

export const useModalUser = create<ModalUserState>((set) => ({
  isModalUserOpen: false,
  toggleModalUser: () =>
    set((state) => ({
      isModalUserOpen: !state.isModalUserOpen
    }))
}))
