import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'

export abstract class CustomerRepository {
      abstract getCustomers(param: {
        pageIndex: number;
        pageSize: number;
      }): Promise<PaginatedItemsViewModel<CustomerModel>>;
}
