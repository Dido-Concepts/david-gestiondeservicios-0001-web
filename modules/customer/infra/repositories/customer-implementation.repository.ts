import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { injectable } from 'inversify'
import { CustomerMapper } from '../mappers/customer.mapper'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerModel } from '../../domain/models/customer.model'
import { axiosApiInterna } from '@/config/axiosApiInterna'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { CustomerEntity } from './entities/customer.entity'

@injectable()
export class CustomerImplementationRepository implements CustomerRepository {
  public locationMapper = new CustomerMapper()

  async getCustomers (param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<CustomerModel>> {
    const { pageIndex, pageSize } = param

    const url = `/api/v1/v1/customer?page_index=${pageIndex}&page_size=${pageSize}`

    const response = await axiosApiInterna.get(url)

    const paginatedItemsEntity: PaginatedItemsViewEntity<CustomerEntity> =
      response.data

    return {
      data: paginatedItemsEntity.data.map((item) =>
        this.locationMapper.mapFrom(item)
      ),
      meta: {
        page: paginatedItemsEntity.meta.page,
        pageSize: paginatedItemsEntity.meta.page_size,
        pageCount: paginatedItemsEntity.meta.page_count,
        total: paginatedItemsEntity.meta.total
      }
    }
  }
}
