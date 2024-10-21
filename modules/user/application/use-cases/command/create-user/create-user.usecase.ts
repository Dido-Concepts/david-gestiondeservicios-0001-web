import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { UseCase } from '@/modules/share/domain/usecase'
import { CreateUserCommand } from '@/modules/user/application/use-cases/command/create-user/create-user.command'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'

@injectable()
export class CreateUserUseCase
implements UseCase<CreateUserCommand, boolean> {
  constructor (
        @inject(USER_MODULE_TYPES.UserRepository)
        private userRepository: UserRepository
  ) {}

  execute (param: CreateUserCommand): Promise<boolean> {
    return this.userRepository.createUser(param)
  }
}
