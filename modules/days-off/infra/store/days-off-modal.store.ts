import { create } from 'zustand'
import { DaysOffModel } from '@/modules/days-off/domain/models/days-off.model'

interface ModalDaysOffFormState {
  isModalOpen: boolean
  dayOff: DaysOffModel | null
  employeeName: string
  selectedDate: string
  userId: number
  setDayOff: (dayOff: DaysOffModel | null) => void
  setEmployeeInfo: (employeeName: string, selectedDate: string, userId: number) => void
  toggleModal: () => void
  reset: () => void
}

export const useModalDaysOffForm = create<ModalDaysOffFormState>((set) => ({
  isModalOpen: false,
  dayOff: null,
  employeeName: '',
  selectedDate: '',
  userId: 0,
  setDayOff: (dayOffChange: DaysOffModel | null) =>
    set(() => ({
      dayOff: dayOffChange
    })),
  setEmployeeInfo: (employeeName: string, selectedDate: string, userId: number) =>
    set(() => ({
      employeeName,
      selectedDate,
      userId
    })),
  toggleModal: () =>
    set((state) => ({
      isModalOpen: !state.isModalOpen
    })),
  reset: () =>
    set(() => ({
      isModalOpen: false,
      dayOff: null,
      employeeName: '',
      selectedDate: '',
      userId: 0
    }))
}))
