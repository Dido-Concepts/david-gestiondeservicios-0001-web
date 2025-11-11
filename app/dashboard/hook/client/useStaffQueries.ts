'use client'

import { useQuery } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Tipos específicos para Staff/Barberos
export type StaffRole = {
  role_id: number
  role_name: string
}

export type StaffResponseModel = {
  id: number
  user_name: string
  email: string
  status: 'ACTIVE' | 'INACTIVE'
  location_id: number
  location_name: string
  roles: StaffRole[]
  created_at: string
  updated_at: string
}

// Query Keys
export const STAFF_QUERY_KEYS = {
  staff: ['calendar', 'staff'] as const
}

/**
 * Hook para obtener el staff/barberos disponibles por ubicación usando la API v2
 */
export const useStaff = (
  staffParams: {
    location_id: string
    role_id?: number
    pageIndex: number
    pageSize: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    query?: string
    fields?: string
    filters?: {
      role_id?: number
      location_id?: number
    }
    enabled?: boolean // Parámetro para controlar cuándo ejecutar la query
  } = {
    location_id: '',
    role_id: 7, // Por defecto role_id = 7 para barberos
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    enabled: true // Por defecto habilitado para mantener compatibilidad
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...STAFF_QUERY_KEYS.staff, staffParams],
    queryFn: async (): Promise<PaginatedItemsViewModel<StaffResponseModel>> => {
      const filters = {
        role_id: staffParams.role_id || 7, // Siempre 7 para barberos
        location_id: parseInt(staffParams.location_id)
      }

      const response = await axiosClientApi.get('/api/v2/staff', {
        params: {
          page_index: staffParams.pageIndex,
          page_size: staffParams.pageSize,
          order_by: staffParams.orderBy,
          sort_by: staffParams.sortBy,
          query: staffParams.query,
          fields: staffParams.fields,
          filters: JSON.stringify(filters)
        }
      })
      return response.data
    },
    enabled: hasTokens && staffParams.enabled && Boolean(staffParams.location_id), // Solo ejecutar si hay tokens, está habilitado y hay location_id
    staleTime: 1000 * 60 * 10, // 10 minutos para staff (pueden cambiar)
    gcTime: 1000 * 60 * 30 // 30 minutos
  })
}
