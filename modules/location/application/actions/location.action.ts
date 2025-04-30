'use server'

import container from '@/config/di/container'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '@/modules/location/domain/types-module/location-types.module'

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

export async function changeStatusLocation (id: string) {
  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.changeStatusLocation(id)
}

export async function updateDetailsLocation (formData: FormData) {
  const idLocation = formData.get('idLocation') as string
  const nameLocation = formData.get('nameLocation') as string
  const phoneLocation = formData.get('phoneLocation') as string
  const addressLocation = formData.get('addressLocation') as string
  const reviewLocation = formData.get('reviewLocation') as string | undefined
  const imgLocation = formData.get('imgLocation') as File | null

  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.updateDetailsLocation({
    idLocation,
    nameLocation,
    phoneLocation,
    addressLocation,
    reviewLocation,
    imgLocation
  })
}

export async function updateScheduleLocation ({
  idLocation,
  schedule
}: {
  idLocation: string;
  schedule: {
    day: string;
    ranges: {
      start: string;
      end: string;
    }[];
  }[];
}) {
  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.updateScheduleLocation({
    idLocation,
    schedule
  })
}

export async function getLocationsCatalog () {
  const locationRepository = container.get<LocationRepository>(
    LOCATION_MODULE_TYPES.LocationRepository
  )
  return await locationRepository.getLocationsCatalog()
}
