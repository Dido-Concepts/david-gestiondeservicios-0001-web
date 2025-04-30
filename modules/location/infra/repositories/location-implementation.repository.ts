import { axiosApiInterna } from '@/config/axiosApiInterna'
import { LocationBodyModel, LocationModel } from '@/modules/location/domain/models/location.model'
import { LocationRepository } from '@/modules/location/domain/repositories/location.repository'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { injectable } from 'inversify'
import 'reflect-metadata'
import { LocationMapper } from '@/modules/location/infra/mappers/location.mapper'
import {
  LocationByIdEntity,
  LocationCatalogEntity,
  LocationsEntity
} from '@/modules/location/infra/repositories/entities/location.entity'

@injectable()
export class LocationImplementationRepository implements LocationRepository {
  public locationMapper = new LocationMapper()

  async getListLocations (param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<Omit<LocationModel, 'openingHours'>>> {
    const { pageIndex, pageSize } = param

    const url = `/api/v1/locations?page_index=${pageIndex}&page_size=${pageSize}`

    const response = await axiosApiInterna.get(url)

    const paginatedItemsEntity: PaginatedItemsViewEntity<LocationsEntity> =
      response.data

    return this.locationMapper.mapFrom(paginatedItemsEntity)
  }

  async getLocationById (id: string): Promise<LocationModel> {
    const url = `/api/v1/location/${id}`

    const response = await axiosApiInterna.get(url)

    const locationEntity: LocationByIdEntity = response.data

    return this.locationMapper.mapFromForId(locationEntity)
  }

  async createLocation (location: {
    nameLocation: string;
    phoneLocation: string;
    addressLocation: string;
    reviewLocation: string;
    imgLocation: File;
    schedule: {
      day: string;
      ranges: {
        start: string;
        end: string;
      }[];
    }[];
  }): Promise<number> {
    const formData = new FormData()
    formData.append('name_location', location.nameLocation)
    formData.append('phone', location.phoneLocation)
    formData.append('address', location.addressLocation)
    formData.append('location_review', location.reviewLocation)
    formData.append('schedule', JSON.stringify(location.schedule))
    formData.append('img_file', location.imgLocation)

    const url = '/api/v1/location'

    const response = await axiosApiInterna.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  }

  async changeStatusLocation (id: string): Promise<string> {
    const url = `/api/v1/location/${id}/status`
    const response = await axiosApiInterna.put(url)

    return response.data
  }

  async updateDetailsLocation (location: {
    idLocation: string;
    nameLocation: string;
    phoneLocation: string;
    addressLocation: string;
    reviewLocation: string ;
    imgLocation: File | null;
  }) : Promise<string> {
    const formData = new FormData()
    formData.append('name_location', location.nameLocation)
    formData.append('phone', location.phoneLocation)
    formData.append('address', location.addressLocation)
    formData.append('location_review', location.reviewLocation)

    if (location.imgLocation) {
      formData.append('img_file', location.imgLocation)
    }

    const url = `/api/v1/location/${location.idLocation}/details`

    const response = await axiosApiInterna.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  }

  async updateScheduleLocation (location: {
    idLocation: string;
    schedule: {
      day: string;
      ranges: {
        start: string;
        end: string;
      }[];
    }[];
  }): Promise<string> {
    const formData = new FormData()
    formData.append('schedule', JSON.stringify(location.schedule))

    const url = `/api/v1/location/${location.idLocation}/schedule`

    const response = await axiosApiInterna.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  }

  async getLocationsCatalog (): Promise<LocationBodyModel[]> {
    const url = '/api/v1/location/list-catalog'

    const response = await axiosApiInterna.get(url)

    const locationsCatalog: LocationCatalogEntity[] = response.data

    return locationsCatalog.map((item) => this.locationMapper.mapFromForCatalog(item))
  }
}
