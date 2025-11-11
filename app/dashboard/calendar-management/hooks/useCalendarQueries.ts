'use client'

import { useQuery } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { LocationResponseModel } from '@/modules/location/domain/models/location.model'

// Query Keys
export const CALENDAR_QUERY_KEYS = {
  locations: ['calendar', 'locations'] as const
}

/**
 * Hook para obtener las ubicaciones disponibles usando la API v2
 */
export const useLocations = (
  locationParams: {
    pageIndex: number
    pageSize: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    query?: string
    fields?: string
    filters?: {
      status?: boolean
      userCreate?: string
    }
  } = {
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    filters: { status: true }
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...CALENDAR_QUERY_KEYS.locations, locationParams],
    queryFn: async (): Promise<PaginatedItemsViewModel<LocationResponseModel>> => {
      const response = await axiosClientApi.get('/api/v2/location', {
        params: {
          page_index: locationParams.pageIndex,
          page_size: locationParams.pageSize,
          order_by: locationParams.orderBy,
          sort_by: locationParams.sortBy,
          query: locationParams.query,
          fields: locationParams.fields,
          filters: locationParams.filters
        }
      })
      return response.data
    },
    enabled: hasTokens,
    staleTime: 1000 * 60 * 15, // 15 minutos para ubicaciones (cambian poco)
    gcTime: 1000 * 60 * 60 // 1 hora
  })
}
