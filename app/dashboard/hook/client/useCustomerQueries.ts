'use client'

import { useQuery } from '@tanstack/react-query'
import { axiosClientApi } from '@/config/axiosClientApi'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerResponseModel } from '@/modules/customer/domain/models/customer.model'

// Query Keys
export const CUSTOMER_QUERY_KEYS = {
  customers: ['calendar', 'customers'] as const
}

/**
 * Hook para obtener los clientes disponibles usando la API v2
 */
export const useCustomers = (
  customerParams: {
    pageIndex: number
    pageSize: number
    orderBy?: string
    sortBy?: 'ASC' | 'DESC'
    query?: string
    fields?: string
    filters?: {
      status_customer?: 'active' | 'blocked'
      user_create?: string
    }
    enabled?: boolean // Nuevo parámetro para controlar cuándo ejecutar la query
  } = {
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    fields: 'name_customer',
    filters: { status_customer: 'active' },
    enabled: true // Por defecto habilitado para mantener compatibilidad
  }
) => {
  const { hasTokens } = useGoogleTokens()

  return useQuery({
    queryKey: [...CUSTOMER_QUERY_KEYS.customers, customerParams],
    queryFn: async (): Promise<PaginatedItemsViewModel<CustomerResponseModel>> => {
      const response = await axiosClientApi.get('/api/v2/customer', {
        params: {
          page_index: customerParams.pageIndex,
          page_size: customerParams.pageSize,
          order_by: customerParams.orderBy,
          sort_by: customerParams.sortBy,
          query: customerParams.query,
          fields: customerParams.fields,
          filters: customerParams.filters
        }
      })
      return response.data
    },
    enabled: hasTokens && customerParams.enabled, // Combinar ambas condiciones
    staleTime: 1000 * 60 * 10, // 10 minutos para clientes (pueden cambiar)
    gcTime: 1000 * 60 * 30 // 30 minutos
  })
}
