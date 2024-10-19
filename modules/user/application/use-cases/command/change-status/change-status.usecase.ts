import 'reflect-metadata'
import { UseCase } from '@/modules/share/domain/usecase'
import { inject, injectable } from 'inversify'
import { ChangeStatusCommand } from './change-status.command'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'

@injectable()
export class ChangeStatusUseCase
implements UseCase<ChangeStatusCommand, boolean> {
  constructor (
    @inject(USER_MODULE_TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  execute (param: ChangeStatusCommand): Promise<boolean> {
    return this.userRepository.changeStatus(param)
  }
}
