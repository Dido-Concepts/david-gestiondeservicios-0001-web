import { LocationModel } from '@/modules/location/domain/models/location.model'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Define la clase abstracta LocationRepository para manejar las ubicaciones
export abstract class LocationRepository {
  // Método para obtener una lista paginada de ubicaciones con un posible filtro de búsqueda
  abstract getListLocations(param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<LocationModel>>;
}
