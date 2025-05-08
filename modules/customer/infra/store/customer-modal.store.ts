import { create } from 'zustand'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'

interface CustomerModalState {
  isModalOpen: boolean;
  customer: CustomerModel | null;
  setCustomer: (customer: CustomerModel | null) => void;
  toggleModal: () => void;
}

export const useCustomerModal = create<CustomerModalState>((set) => ({
  isModalOpen: false,
  customer: null,
  setCustomer: (customerChange: CustomerModel | null) =>
    set(() => ({
      customer: customerChange
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
