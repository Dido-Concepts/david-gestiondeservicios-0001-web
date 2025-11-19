'use server'

import container from '@/config/di/container'
import { UserLocationRepository } from '@/modules/user-location/domain/repositories/user-location.repository'
import { USER_LOCATION_MODULE_TYPES } from '@/modules/user-location/domain/types-module/user-location-types.module'

export async function getUserLocationEvents (params: {
  sedeId: string;
  startDate: string;
  endDate: string;
}) {
  const userLocationRepository = container.get<UserLocationRepository>(
    USER_LOCATION_MODULE_TYPES.UserLocationRepository
  )
  return await userLocationRepository.getUserLocationEvents(params)
}

export async function assignUserToLocation (params: {
  sedeId: number;
  userId: number;
}) {
  const userLocationRepository = container.get<UserLocationRepository>(
    USER_LOCATION_MODULE_TYPES.UserLocationRepository
  )
  return await userLocationRepository.assignUserToLocation(params)
}

export async function deactivateUserFromLocation (params: {
  sedeId: number;
  userId: number;
}) {
  const userLocationRepository = container.get<UserLocationRepository>(
    USER_LOCATION_MODULE_TYPES.UserLocationRepository
  )
  return await userLocationRepository.deactivateUserFromLocation(params)
}
