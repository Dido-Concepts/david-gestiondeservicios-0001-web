'use server'

import container from '@/config/di/container'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '@/modules/location/domain/types-module/user-types.module'

export async function getLocations (params: {
  pageIndex: number;
  pageSize: number;
}) {
  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.getListLocations(params)
}

export async function getLocationById (id: string) {
  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.getLocationById(id)
}

export async function createLocation (formData: FormData) {
  const nameLocation = formData.get('nameLocation') as string
  const phoneLocation = formData.get('phoneLocation') as string
  const addressLocation = formData.get('addressLocation') as string
  const reviewLocation = formData.get('reviewLocation') as string | undefined
  const imgLocation = formData.get('imgLocation') as File
  const scheduleStr = formData.get('schedule') as string
  const schedule = JSON.parse(scheduleStr)

  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.createLocation({
    nameLocation,
    phoneLocation,
    addressLocation,
    reviewLocation,
    imgLocation,
    schedule
  })
}
