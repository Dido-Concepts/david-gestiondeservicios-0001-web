import { axiosApiInterna } from '@/config/axiosApiInterna'
import { LocationModel } from '@/modules/location/domain/models/location.model'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { LocationMapper } from '@/modules/location/infra/mappers/location.mapper'
import { LocationEntity } from '@/modules/location/infra/repositories/entities/location.entity'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class LocationImplementationRepository implements LocationRepository {
  public locationMapper = new LocationMapper()

  async getListLocations (param: {
    pageIndex: number;
    pageSize: number;
    query?: string;
  }): Promise<PaginatedItemsViewModel<LocationModel>> {
    // Construir la URL con parámetros de paginación y búsqueda
    let url = `/api/v1/location?page_index=${param.pageIndex}&page_size=${param.pageSize}`

    if (param.query && param.query.trim() !== '') {
      url += `&query=${encodeURIComponent(param.query)}`
    }

    // Realizar la solicitud a la API
    const response = await axiosApiInterna.get(url)

    // Mapear la entidad paginada desde la API a un modelo de dominio usando LocationMapper
    const paginatedItemsEntity: PaginatedItemsViewEntity<LocationEntity> = response.data

    return this.locationMapper.mapFrom(paginatedItemsEntity)
  }
}
