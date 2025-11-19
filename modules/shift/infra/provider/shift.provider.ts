import { ContainerModule, interfaces } from 'inversify'
import { ShiftRepository } from '@/modules/shift/domain/repositories/shift.repository'
import { SHIFT_MODULE_TYPES } from '@/modules/shift/domain/types-module/shift-types.module'
import { ShiftImplementationRepository } from '@/modules/shift/infra/repositories/shift-implementation.repository'

export const ShiftModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<ShiftRepository>(SHIFT_MODULE_TYPES.ShiftRepository).to(ShiftImplementationRepository).inSingletonScope()
})
