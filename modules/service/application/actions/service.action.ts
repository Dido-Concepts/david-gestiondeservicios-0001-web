'use server'

import { axiosApiInterna } from '@/config/axiosApiInterna'
import container from '@/config/di/container'
import { ServiceRepository } from '@/modules/service/domain/repositories/service.repository'
import { SERVICE_MODULE_TYPES } from '@/modules/service/domain/types-module/service-types.module'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { ServiceResponseModel } from '@/modules/service/domain/models/service.model'

export async function createService (params: {
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.createService(params)
}

export async function updateService (params: {
    service_id: number;
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.updateService(params)
}

export async function deleteService (params: {
    service_id: number;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.deleteService(params)
}

export type ServiceSearchParams = {
  location_id: string;
  pageIndex: number;
  pageSize: number;
  orderBy: 'service_id' | 'service_name' | 'duration_minutes' | 'price' | 'category_name' | 'insert_date' | 'update_date';
  sortBy: 'ASC' | 'DESC';
  query?: string;
  fields?: string;
  filters?: {
    category_id?: number;
    user_create?: string;
  };
}

export async function getServicesV2 (params: ServiceSearchParams): Promise<PaginatedItemsViewModel<ServiceResponseModel>> {
  const url = `/api/v2/services/location/${params.location_id}`
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

  const res: PaginatedItemsViewModel<ServiceResponseModel> = {
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
