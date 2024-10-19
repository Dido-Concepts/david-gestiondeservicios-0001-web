import 'reflect-metadata'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { UseCase } from '@/modules/share/domain/usecase'
import { ListUsersQuery } from '@/modules/user/application/use-cases/query/list-users/list-users.query'
import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { USER_MODULE_TYPES } from '@/modules/user/domain/types-module/user-types.module'
import { inject, injectable } from 'inversify'

@injectable()
export class ListUsersUseCase
implements UseCase<ListUsersQuery, PaginatedItemsViewModel<ListUsersResponse>> {
  constructor (
    @inject(USER_MODULE_TYPES.UserRepository)
    private userRepository: UserRepository
  ) {}

  async execute (param: ListUsersQuery): Promise<PaginatedItemsViewModel<ListUsersResponse>> {
    const responseRepository = await this.userRepository.getListUsers(param)

    const data: PaginatedItemsViewModel<ListUsersResponse> = {
      data: responseRepository.data.map((item) => ({
        id: item.id,
        userName: item.userName,
        email: item.email,
        status: item.status,
        role: {
          id: item.role.id,
          nameRole: item.role.description
        },
        createdAt: item.createdAt
      })),
      meta: {
        page: responseRepository.meta.page,
        pageCount: responseRepository.meta.pageCount,
        pageSize: responseRepository.meta.pageSize,
        total: responseRepository.meta.total
      }
    }

    return data
  }
}
