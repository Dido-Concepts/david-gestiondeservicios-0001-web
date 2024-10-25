import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { UserModel, UserStatus } from '@/modules/user/domain/models/user.model'

export abstract class UserRepository {
  abstract getListUsers(param: {
    pageIndex: number;
    pageSize: number;
    query?: string;
  }): Promise<PaginatedItemsViewModel<UserModel>>;

  abstract changeStatus(param: {
    idUser: number;
    status: UserStatus;
  }): Promise<boolean>;

  abstract createUser(params: {
    name: string;
    email: string;
    idRole: number;
  }): Promise<boolean>;

  abstract editUser(params: {
    userName: string;
    idUser: number;
    idRole: number;
  }): Promise<boolean>;
}
