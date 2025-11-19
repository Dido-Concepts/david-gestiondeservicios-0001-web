'use server'

import { axiosApiInterna } from '@/config/axiosApiInterna'
import container from '@/config/di/container'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '@/modules/location/domain/types-module/location-types.module'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { LocationResponseModel } from '@/modules/location/domain/models/location.model'

// Tipo compartido para los parámetros de búsqueda de ubicaciones

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

export type LocationSearchParams = {
  pageIndex: number;
  pageSize: number;
  orderBy: 'id' | 'nombre_sede' | 'telefono_sede' | 'direccion_sede' | 'insert_date' | 'update_date' | 'status';
  sortBy: 'ASC' | 'DESC';
  query?: string;
  fields?: string;
  filters?: {
    status?: boolean;
    user_create?: string;
  };
}

export async function getListLocationsV2 (params: LocationSearchParams): Promise<PaginatedItemsViewModel<LocationResponseModel>> {
  const url = '/api/v2/location'
  console.log('Fetching location with URL:', url) // Debug log
  console.log('With params:', params) // Debug log

  const response = await axiosApiInterna.get(url, {
    params: {
      page_index: params.pageIndex,
      page_size: params.pageSize,
      order_by: params.orderBy,
      sort_by: params.sortBy,
      query: params.query,
      fields: params.fields,
      filters: JSON.stringify(params.filters)
    }
  })

  const res: PaginatedItemsViewModel<LocationResponseModel> = {
    data: response.data.data,
    meta: {
      page: response.data.meta.page,
      pageSize: response.data.meta.page_size,
      pageCount: response.data.meta.page_count,
      total: response.data.meta.total
    }
  }

  return res
}
