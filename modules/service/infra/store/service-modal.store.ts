import { create } from 'zustand'
import { ServiceModel } from '@/modules/service/domain/models/service.model'

interface ModalServiceState {
  isModalOpen: boolean;
  service: ServiceModel | null;
  setService: (service: ServiceModel | null) => void;
  toggleModal: () => void;
}

export const useModalService = create<ModalServiceState>((set) => ({
  isModalOpen: false,
  service: null,
  setService: (service: ServiceModel | null) =>
    set(() => ({
      service
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
