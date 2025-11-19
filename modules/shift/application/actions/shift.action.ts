'use server'

import container from '@/config/di/container'
import { CreateShiftRequest, UpdateShiftRequest, UpdateShiftDetailsRequest, CancelShiftRequest } from '@/modules/shift/domain/models/shift.model'
import { ShiftRepository } from '@/modules/shift/domain/repositories/shift.repository'
import { SHIFT_MODULE_TYPES } from '@/modules/shift/domain/types-module/shift-types.module'

export async function createShift (shift: CreateShiftRequest) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.createShift(shift)
}

export async function updateShift (id: number, shift: UpdateShiftRequest) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.updateShift(id, shift)
}

export async function updateShiftDetails (id: number, details: UpdateShiftDetailsRequest) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.updateShiftDetails(id, details)
}

export async function deleteShift (id: number) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.deleteShift(id)
}

export async function getShiftById (id: number) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.getShiftById(id)
}

export async function getShiftsByUser (userId: number) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.getShiftsByUser(userId)
}

export async function getShiftsByLocation (sedeId: number, startDate: string, endDate: string) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.getShiftsByLocation(sedeId, startDate, endDate)
}

export async function cancelShift (request: CancelShiftRequest) {
  const shiftRepository = container.get<ShiftRepository>(
    SHIFT_MODULE_TYPES.ShiftRepository
  )
  return await shiftRepository.cancelShift(request)
}
