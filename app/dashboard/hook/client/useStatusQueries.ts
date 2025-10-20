'use client'

import { useQuery } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Tipos específicos para Status/Estados
export type StatusResponseModel = {
  maintable_id: number
  parent_maintable_id: number | null
  table_name: string
  item_text: string
  item_value: string
  item_order: number
  description: string | null
  insert_date: string
  update_date: string
  user_create: string
  user_modify: string | null
}

// Query Keys
export const STATUS_QUERY_KEYS = {
  status: ['calendar', 'status'] as const
}

/**
 * Hook para obtener los estados de citas disponibles usando la API v1 maintable
 */
export const useStatus = (
  statusParams: {
    table_name: string
    pageIndex: number
    pageSize: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    enabled?: boolean // Parámetro para controlar cuándo ejecutar la query
  } = {
    table_name: 'StatusCitaCalendario',
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'item_order',
    sortBy: 'ASC',
    enabled: true // Por defecto habilitado para mantener compatibilidad
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...STATUS_QUERY_KEYS.status, statusParams],
    queryFn: async (): Promise<PaginatedItemsViewModel<StatusResponseModel>> => {
      const response = await axiosClientApi.get(`/api/v1/maintable/${statusParams.table_name}`, {
        params: {
          page_index: statusParams.pageIndex,
          page_size: statusParams.pageSize,
          order_by: statusParams.orderBy,
          sort_by: statusParams.sortBy
        }
      })
      return response.data
    },
    enabled: hasTokens && statusParams.enabled && Boolean(statusParams.table_name), // Solo ejecutar si hay tokens, está habilitado y hay table_name
    staleTime: 1000 * 60 * 30, // 30 minutos para estados (raramente cambian)
    gcTime: 1000 * 60 * 60 * 2 // 2 horas
  })
}
