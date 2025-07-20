import { Role } from '@/modules/role/domain/models/role.model'

export abstract class RoleRepository {
  abstract getRoles(): Promise<Role[]>
}
