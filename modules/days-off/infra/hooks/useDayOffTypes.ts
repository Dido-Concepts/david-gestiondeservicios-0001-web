import { useQuery } from '@tanstack/react-query'
import { getDayOffTypes } from '@/modules/days-off/application/days-off.action'
import { GetDayOffTypesParams } from '@/modules/days-off/domain/models/days-off.model'
import { QUERY_KEYS_DAYS_OFF_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

interface UseDayOffTypesOptions {
  page_index?: number
  page_size?: number
  order_by?: string
  sort_by?: 'ASC' | 'DESC'
  query?: string
  fields?: string
}

export const useDayOffTypes = (options: UseDayOffTypesOptions = {}) => {
  const params: GetDayOffTypesParams = {
    table_name: 'TipoDiaLibre',
    page_index: options.page_index || 1,
    page_size: options.page_size || 100,
    order_by: options.order_by || 'item_order',
    sort_by: options.sort_by || 'ASC',
    query: options.query,
    fields: options.fields
  }

  return useQuery({
    queryKey: [QUERY_KEYS_DAYS_OFF_MANAGEMENT.DOGetDayOffTypes, params],
    queryFn: () => getDayOffTypes(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    select: (data) => {
      if (!data || !data.data || !Array.isArray(data.data)) {
        return { data: [], meta: null, types: [] }
      }

      return {
        ...data,
        types: data.data.map(type => ({
          id: type.maintable_id,
          name: type.item_text,
          value: type.item_value,
          description: type.description,
          order: type.item_order
        }))
      }
    }
  })
}
