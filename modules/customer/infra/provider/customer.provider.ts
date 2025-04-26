import { ContainerModule, interfaces } from 'inversify'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { CUSTOMER_MODULE_TYPES } from '@/modules/customer/domain/types-module/customer-types.module'
import { CustomerImplementationRepository } from '@/modules/customer/infra/repositories/customer-implementation.repository'

export const CustomerModule = new ContainerModule((bind:interfaces.Bind) => {
  bind<CustomerRepository>(CUSTOMER_MODULE_TYPES.CustomerRepository).to(CustomerImplementationRepository).inSingletonScope()
})
