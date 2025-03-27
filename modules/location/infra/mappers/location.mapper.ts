import { Mapper } from '@/modules/share/domain/mapper'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { LocationByIdEntity, LocationsEntity } from '../repositories/entities/location.entity'
import { LocationModel } from '../../domain/models/location.model'

export class LocationMapper extends Mapper<
  PaginatedItemsViewEntity<LocationsEntity>,
  PaginatedItemsViewModel<Omit<LocationModel, 'openingHours'>>
> {
  mapFrom (param: PaginatedItemsViewEntity<LocationsEntity>): PaginatedItemsViewModel<Omit<LocationModel, 'openingHours'>> {
    return {
      data: param.data.map((item) => ({
        id: item.id,
        name: item.name_location,
        address: item.address_location,
        phone: item.phone_location,
        imageUrl: item.url,
        registrationDate: item.insert_date,
        review: item.location_review,
        status: item.annulled
      })),
      meta: {
        page: param.meta.page,
        pageCount: param.meta.page_count,
        pageSize: param.meta.page_size,
        total: param.meta.total
      }
    }
  }

  mapTo (param: PaginatedItemsViewModel<Omit<LocationModel, 'openingHours'>>): PaginatedItemsViewEntity<LocationsEntity> {
    return {
      data: param.data.map((item) => ({
        id: item.id,
        name_location: item.name,
        address_location: item.address,
        phone_location: item.phone,
        content_type: 'location',
        filename: 'location',
        location_review: item.review,
        size: 0,
        url: item.imageUrl,
        insert_date: item.registrationDate,
        annulled: item.status
      })),
      meta: {
        page: param.meta.page,
        page_count: param.meta.pageCount,
        page_size: param.meta.pageSize,
        total: param.meta.total
      }
    }
  }

  mapFromForId (param: LocationByIdEntity): LocationModel {
    return {
      id: param.id,
      name: param.name_location,
      address: param.address_location,
      phone: param.phone_location,
      imageUrl: param.file.url,
      registrationDate: param.insert_date,
      review: param.location_review,
      status: true,
      openingHours: param.schedules.map((item) => ({
        id_OpeningHour: item.id,
        day: item.day,
        open: item.start_time,
        close: item.end_time
      }))
    }
  }
}
