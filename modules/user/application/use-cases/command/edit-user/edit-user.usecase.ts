import { UseCase } from '@/modules/share/domain/usecase'
import { EditUserCommand } from '@/modules/user/application/use-cases/command/edit-user/edit-user.command'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class EditUserUseCase
implements UseCase<EditUserCommand, boolean> {
  constructor (
        @inject(USER_MODULE_TYPES.UserRepository)
        private userRepository: UserRepository
  ) {}

  execute (param: EditUserCommand): Promise<boolean> {
    return this.userRepository.editUser(param)
  }
}
