'use server'

import { axiosApiInterna } from '@/config/axiosApiInterna'
import container from '@/config/di/container'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { CUSTOMER_MODULE_TYPES } from '@/modules/customer/domain/types-module/customer-types.module'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerResponseModel } from '@/modules/customer/domain/models/customer.model'

export async function getCustomers (params: {
  pageIndex: number;
  pageSize: number;
  query?: string;
}) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.getCustomers(params)
}

export async function changeStatusCustomer (id: string) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.changeStatusCustomer(id)
}

export async function deleteCustomer (id: string) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.deleteCustomer(id)
}

export async function createCustomer (params: {
  name_customer: string;
  email_customer?: string;
  phone_customer?: string;
  birthdate_customer?: string | Date;
  status_customer?: 'active' | 'blocked';
}) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.createCustomer(params)
}

export async function updateDetailsCustomer (params: {
  id: string;
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  birthdate_customer: string | Date;
}) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.updateDetailsCustomer(params)
}

export type CustomerSearchParams = {
  pageIndex: number;
  pageSize: number;
  orderBy: 'id' | 'name_customer' | 'email_customer' | 'phone_customer' | 'birthdate_customer' | 'insert_date' | 'update_date' | 'status_customer';
  sortBy: 'ASC' | 'DESC';
  query?: string;
  fields?: string;
  filters?: {
    status_customer?: 'active' | 'blocked';
    user_create?: string;
  };
}

export async function getCustomersV2 (params: CustomerSearchParams): Promise<PaginatedItemsViewModel<CustomerResponseModel>> {
  const url = '/api/v2/customer'
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

  const res: PaginatedItemsViewModel<CustomerResponseModel> = {
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
