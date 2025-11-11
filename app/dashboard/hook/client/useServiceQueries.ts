'use client'

import { useQuery } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { ServiceResponseModel } from '@/modules/service/domain/models/service.model'

// Query Keys
export const SERVICE_QUERY_KEYS = {
  services: ['calendar', 'services'] as const
}

/**
 * Hook para obtener los servicios disponibles por ubicación usando la API v2
 */
export const useServices = (
  serviceParams: {
    location_id: string
    pageIndex: number
    pageSize: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    query?: string
    fields?: string
    filters?: {
      category_id?: number
      user_create?: string
    }
    enabled?: boolean // Parámetro para controlar cuándo ejecutar la query
  } = {
    location_id: '',
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'service_name',
    sortBy: 'ASC',
    fields: 'service_name,duration_minutes,price,category_name',
    enabled: true // Por defecto habilitado para mantener compatibilidad
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...SERVICE_QUERY_KEYS.services, serviceParams],
    queryFn: async (): Promise<PaginatedItemsViewModel<ServiceResponseModel>> => {
      const response = await axiosClientApi.get(`/api/v2/services/location/${serviceParams.location_id}`, {
        params: {
          page_index: serviceParams.pageIndex,
          page_size: serviceParams.pageSize,
          order_by: serviceParams.orderBy,
          sort_by: serviceParams.sortBy,
          query: serviceParams.query,
          fields: serviceParams.fields,
          filters: serviceParams.filters
        }
      })
      return response.data
    },
    enabled: hasTokens && serviceParams.enabled && Boolean(serviceParams.location_id), // Solo ejecutar si hay tokens, está habilitado y hay location_id
    staleTime: 1000 * 60 * 15, // 15 minutos para servicios (cambian menos frecuentemente)
    gcTime: 1000 * 60 * 60 // 1 hora
  })
}
