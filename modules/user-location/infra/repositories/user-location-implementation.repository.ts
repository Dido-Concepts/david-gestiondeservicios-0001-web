import { axiosApiInterna } from '@/config/axiosApiInterna'
import { UserLocationRepository, UserLocationEvent, AssignUserToLocationResponse } from '@/modules/user-location/domain/repositories/user-location.repository'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class UserLocationImplementationRepository implements UserLocationRepository {
  async getUserLocationEvents (params: {
    sedeId: string;
    startDate: string;
    endDate: string;
  }): Promise<UserLocationEvent[]> {
    const { sedeId, startDate, endDate } = params

    const url = `/api/v1/user-locations/${sedeId}/events?start_date=${startDate}&end_date=${endDate}`

    const response = await axiosApiInterna.get(url)

    return response.data
  }

  async assignUserToLocation (params: {
    sedeId: number;
    userId: number;
  }): Promise<AssignUserToLocationResponse> {
    const { sedeId, userId } = params

    const url = '/api/v1/user-locations/assign'

    const response = await axiosApiInterna.post(url, {
      sede_id: sedeId,
      user_id: userId
    })

    return response.data
  }

  async deactivateUserFromLocation (params: {
    sedeId: number;
    userId: number;
  }): Promise<AssignUserToLocationResponse> {
    const { sedeId, userId } = params

    const url = '/api/v1/user-locations/deactivate'

    const response = await axiosApiInterna.post(url, {
      sede_id: sedeId,
      user_id: userId
    })

    return response.data
  }
}
