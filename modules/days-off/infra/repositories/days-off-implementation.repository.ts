import { axiosApiInterna } from '@/config/axiosApiInterna'
import { CreateDaysOffRequest, DaysOffModel } from '@/modules/days-off/domain/models/days-off.model'
import { DaysOffRepository } from '@/modules/days-off/domain/repositories/days-off.repository'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class DaysOffImplementationRepository implements DaysOffRepository {
  async createDayOff (dayOff: CreateDaysOffRequest): Promise<number> {
    const url = '/api/v1/days-off'

    const response = await axiosApiInterna.post(url, dayOff)

    return response.data.id || response.data
  }

  async getDaysOffByUser (userId: number): Promise<DaysOffModel[]> {
    const url = `/api/v1/days-off/user/${userId}`

    const response = await axiosApiInterna.get(url)

    return response.data
  }

  async updateDayOff (id: number, dayOff: Partial<CreateDaysOffRequest>): Promise<string> {
    const url = `/api/v1/days-off/${id}`

    const response = await axiosApiInterna.put(url, dayOff)

    return response.data
  }

  async deleteDayOff (id: number): Promise<string> {
    const url = `/api/v1/days-off/${id}`

    const response = await axiosApiInterna.delete(url)

    return response.data
  }
}
