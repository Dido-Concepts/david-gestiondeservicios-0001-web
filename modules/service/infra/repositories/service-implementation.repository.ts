import 'reflect-metadata'
import { ServiceRepository } from '@/modules/service/domain/repositories/service.repository'
import { injectable } from 'inversify'
import { axiosApiInterna } from '@/config/axiosApiInterna'

@injectable()
export class ServiceImplementationRepository implements ServiceRepository {
  async createService (param: {
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
  }): Promise<string> {
    const url = '/api/v1/service'
    const response = await axiosApiInterna.post(url, param)
    const data: string = response.data

    return data
  }

  async updateService (param: {
    service_id: number;
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
  }): Promise<string> {
    const url = `/api/v1/service/${param.service_id}`
    const dataBody = {
      service_name: param.service_name,
      category_id: param.category_id,
      price: param.price,
      duration: param.duration,
      description: param.description
    }
    const response = await axiosApiInterna.put(url, dataBody)
    const data: string = response.data

    return data
  }

  async deleteService (param: {
    service_id: number;
  }): Promise<boolean> {
    const url = `/api/v1/service/${param.service_id}`
    const response = await axiosApiInterna.delete(url)
    const data: boolean = response.data

    return data
  }
}
