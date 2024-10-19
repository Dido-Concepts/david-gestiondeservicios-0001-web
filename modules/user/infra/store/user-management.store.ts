import { create } from 'zustand'

interface ModalUserFormState {
  isModalOpen: boolean;
  toggleModal: () => void;
}

export const useModalUserForm = create<ModalUserFormState>((set) => ({
  isModalOpen: false,
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
