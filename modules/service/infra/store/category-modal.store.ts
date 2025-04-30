import { create } from 'zustand'
import { CategoryModel } from '@/modules/service/domain/models/category.model'

interface ModalCategoryState {
  isModalOpen: boolean;
  category: CategoryModel | null;
  setCategory: (category: CategoryModel | null) => void;
  toggleModal: () => void;
}

export const useModalCategory = create<ModalCategoryState>((set) => ({
  isModalOpen: false,
  category: null,
  setCategory: (category: CategoryModel | null) =>
    set(() => ({
      category
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
