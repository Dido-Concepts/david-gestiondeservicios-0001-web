'use server'

import container from '@/config/di/container'
import { ListUsersUseCase } from '@/modules/user/application/use-cases/query/list-users/list-users.usecase'
import { ChangeStatusUseCase } from '@/modules/user/application/use-cases/command/change-status/change-status.usecase'
import { ChangeStatusCommand } from '@/modules/user/application/use-cases/command/change-status/change-status.command'
import { CreateUserUseCase } from '@/modules/user/application/use-cases/command/create-user/create-user.usecase'
import { CreateUserCommand } from '@/modules/user/application/use-cases/command/create-user/create-user.command'
import { EditUserCommand } from '../../application/use-cases/command/edit-user/edit-user.command'
import { EditUserUseCase } from '../../application/use-cases/command/edit-user/edit-user.usecase'

export async function getListUsers (params: { pageIndex: number, pageSize: number, query?: string }) {
  const getMainTableUseCase = container.get<ListUsersUseCase>(ListUsersUseCase)
  return await getMainTableUseCase.execute({ pageIndex: params.pageIndex, pageSize: params.pageSize, query: params.query })
}

export async function changeStatus ({ idUser, status }: ChangeStatusCommand) {
  const changeUserStatus =
    container.get<ChangeStatusUseCase>(ChangeStatusUseCase)
  return await changeUserStatus.execute({ idUser, status })
}

export async function createUser (params: CreateUserCommand) {
  const createUser = container.get<CreateUserUseCase>(CreateUserUseCase)
  return await createUser.execute(params)
}

export async function editUser (params: EditUserCommand) {
  const editUser = container.get<EditUserUseCase>(EditUserUseCase)
  return await editUser.execute(params)
}
