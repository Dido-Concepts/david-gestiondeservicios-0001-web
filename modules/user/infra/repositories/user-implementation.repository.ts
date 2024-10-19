import 'reflect-metadata'
import { axiosApiInterna } from '@/config/axiosApiInterna'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { UserModel, UserStatus } from '@/modules/user/domain/models/user.model'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { injectable } from 'inversify'
import { UserMapper } from '@/modules/user/infra/mappers/user.mapper'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { UserEntity } from '@/modules/user/infra/repositories/entities/user.entity'

@injectable()
export class UserImplementationRepository implements UserRepository {
  public userMapper = new UserMapper()

  async getListUsers (param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<UserModel>> {
    const response = await axiosApiInterna.get(
      `/api/v1/user?page_index=${param.pageIndex}&page_size=${param.pageSize}`
    )

    const paginatedItemsEntity: PaginatedItemsViewEntity<UserEntity> =
      response.data

    return this.userMapper.mapFrom(paginatedItemsEntity)
  }

  async changeStatus (param: {
    idUser: number;
    status: UserStatus;
  }): Promise<boolean> {
    const response = await axiosApiInterna.patch(
      `/api/v1/user?id_user=${param.idUser}&status=${param.status}`
    )

    return response.data
  }
}
