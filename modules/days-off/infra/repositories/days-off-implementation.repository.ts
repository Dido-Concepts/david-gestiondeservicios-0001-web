import { axiosApiInterna } from '@/config/axiosApiInterna'
import { CreateDaysOffRequest, DaysOffModel, DayOffTypesResponse, GetDayOffTypesParams, UpdateDaysOffDetailsRequest } from '@/modules/days-off/domain/models/days-off.model'
import { DaysOffRepository } from '@/modules/days-off/domain/repositories/days-off.repository'
import { AxiosError } from 'axios'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class DaysOffImplementationRepository implements DaysOffRepository {
  async createDayOff (dayOff: CreateDaysOffRequest): Promise<number> {
    const url = '/api/v1/days-off'

    try {
      const response = await axiosApiInterna.post(url, dayOff)
      return response.data.id || response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error creating day off:', error.response?.data)
      }
      throw error
    }
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
    const url = `/api/v1/days-off/${id}/delete`
    const response = await axiosApiInterna.delete(url)
    return response.data
  }

  async getDayOffTypes (params: GetDayOffTypesParams): Promise<DayOffTypesResponse> {
    const url = `/api/v1/maintable/${params.table_name}`

    const queryParams = {
      page_index: params.page_index,
      page_size: params.page_size,
      order_by: params.order_by,
      sort_by: params.sort_by,
      ...(params.query && { query: params.query }),
      ...(params.fields && { fields: params.fields })
    }

    try {
      const response = await axiosApiInterna.get(url, { params: queryParams })
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error fetching day off types:', error.response?.data)
      }
      throw error
    }
  }

  async updateDayOffDetails (dayOffId: number, details: UpdateDaysOffDetailsRequest): Promise<string> {
    const url = `/api/v1/days-off/${dayOffId}/details`

    try {
      const response = await axiosApiInterna.put(url, details)
      return response.data
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error updating day off details:', error.response?.data)
      }
      throw error
    }
  }
}
