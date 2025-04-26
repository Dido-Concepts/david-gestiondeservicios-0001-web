import { ContainerModule, interfaces } from 'inversify'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '@/modules/location/domain/types-module/location-types.module'
import { LocationImplementationRepository } from '@/modules/location/infra/repositories/location-implementation.repository'

export const LocationModule = new ContainerModule((bind:interfaces.Bind) => {
  bind<LocationRepository>(LOCATION_MODULE_TYPES.LocationRepository).to(LocationImplementationRepository).inSingletonScope()
})
