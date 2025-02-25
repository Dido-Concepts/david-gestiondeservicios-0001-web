import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { UseCase } from '@/modules/share/domain/usecase'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { EditLocationCommand } from './edit-location.command'

@injectable()
export class EditLocationUseCase
implements UseCase<EditLocationCommand, boolean> {
  constructor (
        @inject(USER_MODULE_TYPES.UserRepository)
        private locationRepository: LocationRepository
  ) {}

  execute (param: EditLocationCommand): Promise<boolean> {
    return this.locationRepository.editLocation(param)
  }
}

