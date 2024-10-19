import { RoleEntity } from '@/modules/role/infra/repositories/entities/role.entity'

export type UserEntity = {
    id: number,
    user_name: string,
    email: string,
    status: string,
    role: RoleEntity,
    created_at: string
}
