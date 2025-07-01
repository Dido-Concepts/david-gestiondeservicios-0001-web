'use server'

import container from '@/config/di/container'
import { CreateDaysOffRequest } from '@/modules/days-off/domain/models/days-off.model'
import { DaysOffRepository } from '@/modules/days-off/domain/repositories/days-off.repository'
import { DAYS_OFF_MODULE_TYPES } from '@/modules/days-off/domain/types-module/days-off-types.module'

export async function createDayOff (dayOff: CreateDaysOffRequest) {
  const daysOffRepository = container.get<DaysOffRepository>(
    DAYS_OFF_MODULE_TYPES.DaysOffRepository
  )
  return await daysOffRepository.createDayOff(dayOff)
}

export async function getDaysOffByUser (userId: number) {
  const daysOffRepository = container.get<DaysOffRepository>(
    DAYS_OFF_MODULE_TYPES.DaysOffRepository
  )
  return await daysOffRepository.getDaysOffByUser(userId)
}

export async function updateDayOff (id: number, dayOff: Partial<CreateDaysOffRequest>) {
  const daysOffRepository = container.get<DaysOffRepository>(
    DAYS_OFF_MODULE_TYPES.DaysOffRepository
  )
  return await daysOffRepository.updateDayOff(id, dayOff)
}

export async function deleteDayOff (id: number) {
  const daysOffRepository = container.get<DaysOffRepository>(
    DAYS_OFF_MODULE_TYPES.DaysOffRepository
  )
  return await daysOffRepository.deleteDayOff(id)
}
