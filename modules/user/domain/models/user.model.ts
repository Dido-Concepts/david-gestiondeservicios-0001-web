import { Role } from '@/modules/role/domain/models/role.model'

/* eslint-disable no-unused-vars */
export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export type UserModel = {
  id: number;
  userName: string;
  email: string;
  status: UserStatus;
  role: Role;
  createdAt: string;
};
