import { create } from 'zustand'

interface Customer {
  id?: number;
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  birthdate_customer: string;
}

interface CustomerModalState {
  isModalOpen: boolean;
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  toggleModal: () => void;
}

export const useCustomerModal = create<CustomerModalState>((set) => ({
  isModalOpen: false,
  customer: null,
  setCustomer: (customerChange: Customer | null) =>
    set(() => ({
      customer: customerChange
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    }))
}))
