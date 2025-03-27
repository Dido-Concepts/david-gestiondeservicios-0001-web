import container from '@/config/di/container'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '@/modules/location/domain/types-module/user-types.module'

export async function getLocations (params: { pageIndex: number, pageSize: number }) {
  const locationRepository = container.get<LocationRepository>(LOCATION_MODULE_TYPES.LocationRepository)
  return await locationRepository.getListLocations(params)
}

export async function getLocationById (id: string) {
  const locationRepository = container.get<LocationRepository>(LOCATION_MODULE_TYPES.LocationRepository)
  return await locationRepository.getLocationById(id)
}
