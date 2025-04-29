import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'

export abstract class CustomerRepository {
  abstract getCustomers(param: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PaginatedItemsViewModel<CustomerModel>>;

  abstract changeStatusCustomer(id: string): Promise<string>;

  abstract deleteCustomer(id: string): Promise<string>; // <--- NUEVO MÉTODO AÑADIDO

  abstract createCustomer(customerData: { // <--- NUEVO MÉTODO AÑADIDO
    name_customer: string;
    email_customer?: string; // Opcional
    phone_customer?: string; // Opcional
    birthdate_customer?: string | Date; // Opcional, puede ser string 'YYYY-MM-DD' o Date
    status_customer?: 'active' | 'blocked'; // Opcional, con valores predefinidos
  }): Promise<number>; // El backend devuelve el ID como número

  /**
   * Método abstracto para actualizar los detalles de un cliente existente.
   * @param customerData - Objeto con los datos del cliente a actualizar, incluyendo su ID.
   * Los campos requeridos coinciden con la definición del backend.
   * @returns Promise que resuelve con un mensaje de estado (string) desde el backend.
   */
  abstract updateDetailsCustomer(customerData: { // <--- NUEVO MÉTODO AÑADIDO
    customer_id: string; // Se necesita el ID para identificar al cliente
    name_customer: string;
    email_customer: string;
    phone_customer: string;
    birthdate_customer: string | Date; // Puede ser string 'YYYY-MM-DD' o Date
  }): Promise<string>; // El backend devuelve un mensaje de confirmación/error
}
