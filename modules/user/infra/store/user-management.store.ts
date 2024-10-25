import { create } from 'zustand'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'

interface ModalUserFormState {
  isModalOpen: boolean;
  user: ListUsersResponse | null;
  toggleModal: (user?: ListUsersResponse | null) => void;
}

export const useModalUserForm = create<ModalUserFormState>((set) => ({
  isModalOpen: false,
  user: null,
  toggleModal: (user: ListUsersResponse | null = null) =>
    set((state) => ({
      isModalOpen: !state.isModalOpen,
      user
    }))

}))

//
