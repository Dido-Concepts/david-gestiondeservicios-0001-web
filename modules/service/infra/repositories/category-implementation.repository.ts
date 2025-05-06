import 'reflect-metadata'
import { CategoryRepository } from '@/modules/service/domain/repositories/category.repository'
import { CategoryCatalogModel, CategoryModel } from '@/modules/service/domain/models/category.model'
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

    const categories = data.map((item) =>
      this.categoryMapper.mapFrom(item)
    )
    return categories
  }

  async createCategory (param: { name_category: string; description_category: string; location_id: number }): Promise<string> {
    const url = '/api/v1/category'
    const response = await axiosApiInterna.post(url, param)
    const data: string = response.data

    return data
  }

  async updateCategory (param: { id: number; name_category: string; description_category: string; location_id: number }): Promise<string> {
    const url = `/api/v1/category/${param.id}`
    const dataBody = {
      name_category: param.name_category,
      description_category: param.description_category,
      location_id: param.location_id
    }
    const response = await axiosApiInterna.put(url, dataBody)
    const data: string = response.data

    return data
  }

  async deleteCategory (param: { id: number }): Promise<boolean> {
    const url = `/api/v1/category/${param.id}`
    const response = await axiosApiInterna.delete(url)
    const data: boolean = response.data

    return data
  }

  async getAllCategories (param: { sede_id: number }): Promise<CategoryCatalogModel[]> {
    const url = `/api/v1/category/catalog/${param.sede_id}`
    const response = await axiosApiInterna.get(url)
    const data: CategoryCatalogModel[] = response.data

    return data
  }
}
