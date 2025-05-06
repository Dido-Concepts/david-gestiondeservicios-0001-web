import { ContainerModule, interfaces } from 'inversify'
import { CategoryRepository } from '@/modules/service/domain/repositories/category.repository'
import { CATEGORY_MODULE_TYPES, SERVICE_MODULE_TYPES } from '@/modules/service/domain/types-module/service-types.module'
import { CategoryImplementationRepository } from '@/modules/service/infra/repositories/category-implementation.repository'
import { ServiceRepository } from '@/modules/service/domain/repositories/service.repository'
import { ServiceImplementationRepository } from '@/modules/service/infra/repositories/service-implementation.repository'

export const ServiceModule = new ContainerModule((bind:interfaces.Bind) => {
  bind<CategoryRepository>(CATEGORY_MODULE_TYPES.CategoryRepository).to(CategoryImplementationRepository).inSingletonScope()
  bind<ServiceRepository>(SERVICE_MODULE_TYPES.ServiceRepository).to(ServiceImplementationRepository).inSingletonScope()
})
