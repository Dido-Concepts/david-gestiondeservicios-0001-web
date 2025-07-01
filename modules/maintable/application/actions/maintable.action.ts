'use server'

import { axiosApiInterna } from '@/config/axiosApiInterna'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { MaintableResponseModel } from '@/modules/maintable/domain/models/maintable.model'

export type MaintableSearchParams = {
  table_name: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'maintable_id' | 'parent_maintable_id' | 'table_name' | 'item_text' | 'item_value' | 'item_order' | 'insert_date' | 'update_date';
  sortBy: 'ASC' | 'DESC';
  query?: string;
  fields?: string;
  filters?: {
    parent_maintable_id?: number;
    user_create?: string;
  };
}

export async function getMaintableV2 (params: MaintableSearchParams): Promise<PaginatedItemsViewModel<MaintableResponseModel>> {
  const url = `/api/v1/maintable/${params.table_name}`
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

  const res: PaginatedItemsViewModel<MaintableResponseModel> = {
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
