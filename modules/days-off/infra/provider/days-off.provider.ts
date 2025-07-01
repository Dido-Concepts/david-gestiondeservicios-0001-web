import { ContainerModule, interfaces } from 'inversify'
import { DaysOffRepository } from '@/modules/days-off/domain/repositories/days-off.repository'
import { DAYS_OFF_MODULE_TYPES } from '@/modules/days-off/domain/types-module/days-off-types.module'
import { DaysOffImplementationRepository } from '@/modules/days-off/infra/repositories/days-off-implementation.repository'

export const DaysOffModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<DaysOffRepository>(DAYS_OFF_MODULE_TYPES.DaysOffRepository).to(DaysOffImplementationRepository).inSingletonScope()
})
