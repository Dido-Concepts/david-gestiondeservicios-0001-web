import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { UserImplementationRepository } from '@/modules/user/infra/repositories/user-implementation.repository'
import { ContainerModule, interfaces } from 'inversify'
import { ListUsersUseCase } from '@/modules/user/application/use-cases/query/list-users/list-users.usecase'
import { ChangeStatusUseCase } from '@/modules/user/application/use-cases/command/change-status/change-status.usecase'
import { CreateUserUseCase } from '@/modules/user/application/use-cases/command/create-user/create-user.usecase'
import { EditUserUseCase } from '@/modules/user/application/use-cases/command/edit-user/edit-user.usecase'

export const UserModule = new ContainerModule((bind:interfaces.Bind) => {
  bind<UserRepository>(USER_MODULE_TYPES.UserRepository).to(UserImplementationRepository).inSingletonScope()

  // Use cases
  bind<ListUsersUseCase>(ListUsersUseCase).toSelf().inSingletonScope()
  bind<ChangeStatusUseCase>(ChangeStatusUseCase).toSelf().inSingletonScope()
  bind<CreateUserUseCase>(CreateUserUseCase).toSelf().inSingletonScope()
  bind<EditUserUseCase>(EditUserUseCase).toSelf().inSingletonScope()
})
