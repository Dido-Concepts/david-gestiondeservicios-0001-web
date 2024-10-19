import { UserStatus } from '@/modules/user/domain/models/user.model'

export type ChangeStatusCommand = {
  idUser: number;
  status: UserStatus;
};
