import { create } from 'zustand'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'

interface ModalUserFormState {
  isModalOpen: boolean;
  user: ListUsersResponse | null;
  setUser: (user: ListUsersResponse | null) => void;
  toggleModal: () => void;
}

export const useModalUserForm = create<ModalUserFormState>((set) => ({
  isModalOpen: false,
  user: null,
  setUser: (userChange: ListUsersResponse | null) =>
    set(() => ({
      user: userChange
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
