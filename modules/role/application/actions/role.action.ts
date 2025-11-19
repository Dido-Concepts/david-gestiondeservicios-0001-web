'use server'

import container from '@/config/di/container'
import { RoleRepository } from '@/modules/role/domain/repositories/role.repository'
import { ROLE_MODULE_TYPES } from '@/modules/role/domain/types-module/role-types.module'

export async function getRoles () {
  const roleRepository = container.get<RoleRepository>(
    ROLE_MODULE_TYPES.RoleRepository
  )
  return await roleRepository.getRoles()
}
