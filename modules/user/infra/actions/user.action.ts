'use server'

import container from '@/config/di/container'
import { ListUsersUseCase } from '@/modules/user/application/use-cases/query/list-users/list-users.usecase'
import { ChangeStatusUseCase } from '../../application/use-cases/command/change-status/change-status.usecase'
import { UserStatus } from '@/modules/user/domain/models/user.model'

export async function getListUsers () {
  const getMainTableUseCase = container.get<ListUsersUseCase>(ListUsersUseCase)
  return await getMainTableUseCase.execute({ pageIndex: 1, pageSize: 10 })
}

export async function changeStatus ({ idUser, status }: { idUser: number, status: UserStatus }) {
  const changeUserStatus = container.get<ChangeStatusUseCase>(ChangeStatusUseCase)
  return await changeUserStatus.execute({ idUser, status })
}
