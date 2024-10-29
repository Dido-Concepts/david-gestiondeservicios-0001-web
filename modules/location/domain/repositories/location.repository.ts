import { LocationModel, LocationStatus } from '@/modules/location/domain/models/location.model'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Define la clase abstracta LocationRepository para manejar las ubicaciones
export abstract class LocationRepository {
  // Método para obtener una lista paginada de ubicaciones con un posible filtro de búsqueda
  abstract getListLocations(param: {
    pageIndex: number;
    pageSize: number;
    query?: string;
  }): Promise<PaginatedItemsViewModel<LocationModel>>;

  // Método para cambiar el estado de una ubicación (ej. activada/desactivada)
  abstract changeStatus(param: {
    idLocation: string;
    status: LocationStatus;
  }): Promise<boolean>;

  // Método para crear una nueva ubicación
  abstract createLocation(params: {
    name: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    imageUrl: string;
    registrationDate: string;
    openingHours: Array<{
      day: string;
      open: number;
      close: number;
    }>;
  }): Promise<boolean>;

  // Método para editar una ubicación existente
  abstract editLocation(params: {
    idLocation: string;
    name?: string;
    address?: string;
    city?: string;
    province?: string;
    phone?: string;
    imageUrl?: string;
    openingHours?: Array<{
      day: string;
      open: number;
      close: number;
    }>;
  }): Promise<boolean>;
}
