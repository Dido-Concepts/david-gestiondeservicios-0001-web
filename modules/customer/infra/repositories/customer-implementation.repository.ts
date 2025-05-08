import 'reflect-metadata'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { injectable } from 'inversify'
import { CustomerMapper } from '@/modules/customer/infra/mappers/customer.mapper'
import { PaginatedItemsViewModel } from '@/modules/share/domain/models/paginate/paginated-items-view.model'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'
import { axiosApiInterna } from '@/config/axiosApiInterna'
import { PaginatedItemsViewEntity } from '@/modules/share/infra/entities/paginate/paginated-items-view.entity'
import { CustomerEntity } from './entities/customer.entity'

@injectable()
export class CustomerImplementationRepository implements CustomerRepository {
  public customerMapper = new CustomerMapper()

  async getCustomers (param: {
    pageIndex: number;
    pageSize: number;
    query?: string;
  }): Promise<PaginatedItemsViewModel<CustomerModel>> {
    let url = `/api/v1/customer?page_index=${param.pageIndex}&page_size=${param.pageSize}`

    if (param.query && param.query.trim() !== '') {
      url += `&query=${encodeURIComponent(param.query)}`
    }

    const response = await axiosApiInterna.get(url)

    const paginatedItemsEntity: PaginatedItemsViewEntity<CustomerEntity> =
      response.data

    const responseData = {
      data: paginatedItemsEntity.data.map((item) =>
        this.customerMapper.mapFrom(item)
      ),
      meta: {
        page: paginatedItemsEntity.meta.page,
        pageSize: paginatedItemsEntity.meta.page_size,
        pageCount: paginatedItemsEntity.meta.page_count,
        total: paginatedItemsEntity.meta.total
      }
    }

    console.log({ responseData })
    return responseData
  }

  async changeStatusCustomer (id: string): Promise<string> {
    const url = `/api/v1/customer/${id}/status`
    const response = await axiosApiInterna.put(url)

    return response.data
  }

  async deleteCustomer (id: string): Promise<string> {
    // 1. Construir la URL del endpoint de la API para el borrado lógico.
    //    Se interpola el ID del cliente proporcionado en la ruta.
    //    Ejemplo: /api/v1/customer/123/delete
    const url = `/api/v1/customer/${id}/delete`

    // 2. Realizar la llamada a la API utilizando el método PUT.
    //    Se usa la instancia configurada de Axios (`axiosApiInterna`).
    //    Al igual que `changeStatusCustomer`, esta operación particular no requiere
    //    enviar datos en el cuerpo (payload) de la petición PUT.
    const response = await axiosApiInterna.put(url)

    // 3. Devolver los datos de la respuesta.
    //    Se asume que la API backend, en caso de éxito o error controlado (como 404),
    //    devuelve un mensaje de texto directamente en el cuerpo de la respuesta (`response.data`).
    //    Si ocurre un error de red o un error 5xx no controlado, Axios lanzará una excepción
    //    que deberá ser manejada en un nivel superior (ej. en el caso de uso o componente).
    return response.data
  }

  // --- IMPLEMENTACIÓN DE createCustomer ---
  async createCustomer (customerData: {
    name_customer: string;
    email_customer?: string;
    phone_customer?: string;
    birthdate_customer?: string | Date;
    status_customer?: 'active' | 'blocked';
}): Promise<number> {
    const url = '/api/v1/customer' // Endpoint POST definido en el backend

    // --- LOG DE DEPURACIÓN ---
    console.log('>>> Enviando al Backend API (/api/v1/customer): Payload:')
    console.log(JSON.stringify(customerData, null, 2)) // Imprime el objeto como JSON formateado
    // ------------------------

    // Realiza la petición POST enviando los datos del cliente en formato JSON.
    // Axios se encarga de establecer el Content-Type: application/json por defecto.
    const response = await axiosApiInterna.post(url, customerData)

    // El backend (según customer_v1_routes.py) devuelve directamente el ID numérico
    // en la respuesta (response.data).
    return response.data
  }

  // --- IMPLEMENTACIÓN DE updateDetailsCustomer ---
  async updateDetailsCustomer (customerData: {
    id: string;
    name_customer: string;
    email_customer: string;
    phone_customer: string;
    birthdate_customer: string | Date;
}): Promise<string> {
    // Construye la URL específica para actualizar detalles, incluyendo el ID del cliente.
    const url = `/api/v1/customer/${customerData.id}/details` // Endpoint PUT definido en el backend

    // Prepara el objeto payload que se enviará en el cuerpo de la petición.
    // Este payload debe coincidir con lo que espera el backend (UpdateCustomerDetailsPayload).
    // Excluimos 'customer_id' porque ya va en la URL.
    const payload = {
      name_customer: customerData.name_customer,
      email_customer: customerData.email_customer,
      phone_customer: customerData.phone_customer,
      birthdate_customer: customerData.birthdate_customer
    }

    // Realiza la petición PUT enviando el payload en formato JSON.
    const response = await axiosApiInterna.put(url, payload)

    // El backend (según customer_v1_routes.py) devuelve un mensaje de texto (string)
    // indicando el resultado de la operación.
    return response.data
  }
}
//
