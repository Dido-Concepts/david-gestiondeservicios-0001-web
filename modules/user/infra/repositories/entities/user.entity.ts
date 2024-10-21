import { RoleEntity } from '@/modules/role/infra/repositories/entities/role.entity'
import { UserStatus } from '@/modules/user/domain/models/user.model'

export type UserEntity = {
    id: number
    user_name: string
    email: string
    status: UserStatus
    role: RoleEntity
    created_at: string
}

export type UserCreateEntity = {
    user_name: string
    email: string
    id_rol: number
}

export type UserUpdateEntity = {
    id_rol: number
    id_user: number
    user_name: string
}
