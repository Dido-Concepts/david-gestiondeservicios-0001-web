import { ContainerModule, interfaces } from 'inversify'
import { RoleRepository } from '@/modules/role/domain/repositories/role.repository'
import { ROLE_MODULE_TYPES } from '@/modules/role/domain/types-module/role-types.module'
import { RoleImplementationRepository } from '@/modules/role/infra/repositories/role-implementation.repository'

export const RoleModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<RoleRepository>(ROLE_MODULE_TYPES.RoleRepository).to(RoleImplementationRepository).inSingletonScope()
})
