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
    query?: string;
  }): Promise<PaginatedItemsViewModel<UserModel>> {
    let url = `/api/v1/user?page_index=${param.pageIndex}&page_size=${param.pageSize}`

    if (param.query && param.query.trim() !== '') {
      url += `&query=${encodeURIComponent(param.query)}`
    }

    const response = await axiosApiInterna.get(url)

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

  async createUser (params: { name: string; email: string; idRole: number }): Promise<boolean> {
    const userCreateEntity = this.userMapper.mapCreateEntity(params)

    const response = await axiosApiInterna.post(
      '/api/v1/user',
      userCreateEntity
    )

    return response.data
  }

  async editUser (params: { userName: string; idUser: number; idRole: number }): Promise<boolean> {
    const userEditEntity = this.userMapper.mapEditEntity(params)

    const response = await axiosApiInterna.put(
      '/api/v1/user',
      userEditEntity
    )

    return response.data
  }
}
