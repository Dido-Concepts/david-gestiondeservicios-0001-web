import { UserStatus } from '@/modules/user/domain/models/user.model'

export type ListUsersResponse = {
  id: number;
  userName: string;
  email: string;
  status: UserStatus;
  role: {
    id: number;
    nameRole: string;
  }
  createdAt: string;
};
