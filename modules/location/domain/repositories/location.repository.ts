import { LocationBodyModel, LocationModel } from '@/modules/location/domain/models/location.model'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'

// Define la clase abstracta LocationRepository para manejar las ubicaciones
export abstract class LocationRepository {
  // Método para obtener una lista paginada de ubicaciones con un posible filtro de búsqueda
  abstract getListLocations(param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<Omit<LocationModel, 'openingHours'>>>;

  abstract getLocationById(id: string): Promise<LocationModel>;

  abstract createLocation(location: {
    nameLocation: string;
    phoneLocation: string;
    addressLocation: string;
    reviewLocation: string | undefined;
    imgLocation: File;
    schedule: {
      day: string;
      ranges: {
        start: string;
        end: string;
      }[];
    }[];
  }): Promise<number>;

  abstract changeStatusLocation(id: string): Promise<string>;

  abstract updateDetailsLocation(location: {
    idLocation: string;
    nameLocation: string;
    phoneLocation: string;
    addressLocation: string;
    reviewLocation: string | undefined;
    imgLocation: File | null;
  }) : Promise<string>;

  abstract updateScheduleLocation(location: {
    idLocation: string;
    schedule: {
      day: string;
      ranges: {
        start: string;
        end: string;
      }[];
    }[];
  }): Promise<string>;

  abstract getLocationsCatalog(): Promise<LocationBodyModel[]>;
}
