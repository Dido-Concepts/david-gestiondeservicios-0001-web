import { ContainerModule, interfaces } from 'inversify'
import { UserLocationRepository } from '@/modules/user-location/domain/repositories/user-location.repository'
import { USER_LOCATION_MODULE_TYPES } from '@/modules/user-location/domain/types-module/user-location-types.module'
import { UserLocationImplementationRepository } from '@/modules/user-location/infra/repositories/user-location-implementation.repository'

export const UserLocationModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserLocationRepository>(USER_LOCATION_MODULE_TYPES.UserLocationRepository).to(UserLocationImplementationRepository).inSingletonScope()
})
