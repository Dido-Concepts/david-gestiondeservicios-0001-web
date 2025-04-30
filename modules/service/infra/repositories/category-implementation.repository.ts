import 'reflect-metadata'
import { CategoryRepository } from '@/modules/service/domain/repositories/category.repository'
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { injectable } from 'inversify'
import { CategoryMapper } from '@/modules/service/infra/mappers/category.mapper'
import { axiosApiInterna } from '@/config/axiosApiInterna'
import { CategoryEntity } from './entities/category.entity'

@injectable()
export class CategoryImplementationRepository implements CategoryRepository {
  public categoryMapper = new CategoryMapper()
  async getCategory (param: { location?: string }): Promise<CategoryModel[]> {
    const url = `/api/v1/category?location=${param.location}`
    const response = await axiosApiInterna.get(url)
    const data: CategoryEntity[] = response.data

    return data.map((item) =>
      this.categoryMapper.mapFrom(item)
    )
  }

  async createCategory (param: { name_category: string; description_category: string; location_id: number }): Promise<string> {
    const url = '/api/v1/category'
    const response = await axiosApiInterna.post(url, param)
    const data: string = response.data

    return data
  }
}
