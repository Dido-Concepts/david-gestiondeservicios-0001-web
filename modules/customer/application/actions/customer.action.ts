'use server'

import container from '@/config/di/container'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { CUSTOMER_MODULE_TYPES } from '@/modules/customer/domain/types-module/customer-types.module'

export async function getCustomers (params: {
  pageIndex: number;
  pageSize: number;
}) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.getCustomers({
    pageIndex: params.pageIndex,
    pageSize: params.pageSize
  })
}
