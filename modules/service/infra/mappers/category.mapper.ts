import { Mapper } from '@/modules/share/domain/mapper'
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { CategoryEntity } from '@/modules/service/infra/repositories/entities/category.entity'

export class CategoryMapper extends Mapper<
CategoryEntity,
CategoryModel
> {
  mapFrom (param: CategoryEntity): CategoryModel {
    return {
      id: param.category_id.toString(),
      name: param.category_name,
      description: param.description,
      createdAt: new Date(param.insert_date),
      services: param.services.map((service) => ({
        id: service.service_id.toString(),
        name: service.service_name,
        description: service.description,
        price: service.price,
        duration: service.duration_minutes,
        createdAt: new Date(service.insert_date)
      }))
    }
  }

  mapTo (param: CategoryModel): CategoryEntity {
    return {
      category_id: Number(param.id),
      category_name: param.name,
      description: param.description,
      insert_date: param.createdAt.toISOString(),
      services: param.services.map((service) => ({
        service_id: Number(service.id),
        service_name: service.name,
        duration_minutes: service.duration,
        price: service.price,
        description: service.description,
        insert_date: service.createdAt.toISOString()
      }))
    }
  }
}
