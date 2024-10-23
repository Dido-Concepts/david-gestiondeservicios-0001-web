import { Mapper } from '@/modules/share/domain/mapper'
import { UserCreateEntity, UserEditEntity, UserEntity } from '@/modules/user/infra/repositories/entities/user.entity'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { CreateUserCommand } from '@/modules/user/application/use-cases/command/create-user/create-user.command'
import { EditUserCommand } from '../../application/use-cases/command/edit-user/edit-user.command'

export class UserMapper extends Mapper<PaginatedItemsViewEntity<UserEntity>, PaginatedItemsViewModel<UserModel>> {
  mapFrom (param: PaginatedItemsViewEntity<UserEntity>): PaginatedItemsViewModel<UserModel> {
    return {
      data: param.data.map((item) => ({
        id: item.id,
        userName: item.user_name,
        email: item.email,
        status: item.status,
        role: item.role,
        createdAt: item.created_at
      })),
      meta: {
        page: param.meta.page,
        pageCount: param.meta.page_count,
        pageSize: param.meta.page_size,
        total: param.meta.total
      }
    }
  }

  mapTo (param: PaginatedItemsViewModel<UserModel>): PaginatedItemsViewEntity<UserEntity> {
    return {
      data: param.data.map((item) => ({
        id: item.id,
        user_name: item.userName,
        email: item.email,
        status: item.status,
        role: item.role,
        created_at: item.createdAt
      })),
      meta: {
        page: param.meta.page,
        page_count: param.meta.pageCount,
        page_size: param.meta.pageSize,
        total: param.meta.total
      }
    }
  }

  mapCreateEntity (param: CreateUserCommand) : UserCreateEntity {
    return {
      user_name: param.name,
      email: param.email,
      id_rol: param.idRole
    }
  }

  mapEditEntity (param: EditUserCommand) : UserEditEntity {
    return {
      id_rol: param.idRole,
      id_user: param.idUser,
      user_name: param.userName
    }
  }
}
