import { LocationModel, LocationStatus } from '@/modules/location/domain/models/location.model'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { mockLocationData } from '@/modules/location/infra/mock/location.mock'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class LocationImplementationRepository implements LocationRepository {
  async getListLocations (param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<LocationModel>> {
    const { pageIndex, pageSize } = param

    // Total de locaciones disponibles en el mock
    const totalLocations = mockLocationData.locations.length

    // Calcular los índices de paginación
    const startIndex = pageIndex * pageSize
    const endIndex = startIndex + pageSize

    // Obtener la página actual de locaciones
    const paginatedLocations = mockLocationData.locations.slice(startIndex, endIndex).map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      city: location.city,
      province: location.province,
      phone: location.phone,
      imageUrl: location.imageUrl,
      registrationDate: location.registrationDate,
      status: LocationStatus.ACTIVE, // Estado por defecto
      openingHours: location.openingHours
    }))

    return {
      data: paginatedLocations,
      meta: {
        page: pageIndex,
        pageSize,
        pageCount: Math.ceil(totalLocations / pageSize),
        total: totalLocations
      }
    }
  }
}
