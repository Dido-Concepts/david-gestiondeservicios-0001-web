import { ContainerModule, interfaces } from 'inversify'
import { LocationRepository } from '../../domain/repositories/location.repository'
import { LOCATION_MODULE_TYPES } from '../../domain/types-module/user-types.module'
import { LocationImplementationRepository } from '../repositories/location-implementation.repository'

export const LocationModule = new ContainerModule((bind:interfaces.Bind) => {
  bind<LocationRepository>(LOCATION_MODULE_TYPES.LocationRepository).to(LocationImplementationRepository).inSingletonScope()
})
