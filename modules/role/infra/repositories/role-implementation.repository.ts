import { axiosApiInterna } from '@/config/axiosApiInterna'
import { Role } from '@/modules/role/domain/models/role.model'
import { RoleRepository } from '@/modules/role/domain/repositories/role.repository'
import { AxiosError } from 'axios'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class RoleImplementationRepository implements RoleRepository {
  async getRoles (): Promise<Role[]> {
    const url = '/api/v1/role'

    try {
      const response = await axiosApiInterna.get(url)
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error fetching roles:', error.response?.data)
      }
      throw error
    }
  }
}
