'use server'

import container from '@/config/di/container'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { CUSTOMER_MODULE_TYPES } from '@/modules/customer/domain/types-module/customer-types.module'

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
//
