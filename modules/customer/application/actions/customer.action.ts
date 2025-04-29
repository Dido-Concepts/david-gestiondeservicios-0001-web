'use server'

import container from '@/config/di/container'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { CUSTOMER_MODULE_TYPES } from '@/modules/customer/domain/types-module/customer-types.module'

export async function getCustomers (params: {
  pageIndex: number;
  pageSize: number;
}) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.getCustomers({
    pageIndex: params.pageIndex,
    pageSize: params.pageSize
  })
}

export async function changeStatusCustomer (id: string) {
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )
  return await customerRepository.changeStatusCustomer(id)
}

export async function deleteCustomer (id: string) {
  // 1. Obtener la instancia del repositorio de clientes.
  //    Utilizamos el contenedor de Inyección de Dependencias (`container`)
  //    para solicitar la implementación concreta que se haya registrado
  //    para la interfaz `CustomerRepository` usando su identificador único
  //    (`CUSTOMER_MODULE_TYPES.CustomerRepository`).
  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )

  // 2. Llamar al método `deleteCustomer` del repositorio obtenido.
  //    Se le pasa el `id` del cliente que se recibió como argumento de la Server Action.
  //    Usamos `await` porque el método del repositorio (y la llamada a la API que realiza)
  //    es una operación asíncrona. Esperamos a que termine.
  const result = await customerRepository.deleteCustomer(id)

  // 3. Devolver el resultado de la operación del repositorio.
  //    Este resultado es el mensaje (string) que provino originalmente de la API backend
  //    (ej. "Cliente anulado...", "Error: Cliente no encontrado...").
  return result
}

export async function createCustomer (formData: FormData) {
  const nameCustomer = formData.get('name_customer') as string
  const emailCustomer = formData.get('email_customer') as string | null
  const phoneCustomer = formData.get('phone_customer') as string | null
  const birthdateCustomer = formData.get('birthdate_customer') as string | null
  const statusCustomer = formData.get('status_customer') as 'active' | 'blocked' | null

  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )

  // Construir el objeto para el repositorio usando las claves snake_case requeridas
  const customerDataForRepo: {
    name_customer: string;
    email_customer?: string;
    phone_customer?: string;
    birthdate_customer?: string;
    status_customer?: 'active' | 'blocked';
} = {
  name_customer: nameCustomer // Mapear variable camelCase a clave snake_case
}

  // Añadir opcionales si existen
  if (emailCustomer) customerDataForRepo.email_customer = emailCustomer
  if (phoneCustomer) customerDataForRepo.phone_customer = phoneCustomer
  if (birthdateCustomer) customerDataForRepo.birthdate_customer = birthdateCustomer
  if (statusCustomer) customerDataForRepo.status_customer = statusCustomer

  return await customerRepository.createCustomer(customerDataForRepo)
}

export async function updateDetailsCustomer (formData: FormData) {
  // Extraer con snake_case, asignar a camelCase
  const customerId = formData.get('customer_id') as string
  const nameCustomer = formData.get('name_customer') as string
  const emailCustomer = formData.get('email_customer') as string
  const phoneCustomer = formData.get('phone_customer') as string
  const birthdateCustomer = formData.get('birthdate_customer') as string

  if (!customerId || !nameCustomer || !emailCustomer || !phoneCustomer || !birthdateCustomer) {
    throw new Error('Faltan datos requeridos para actualizar el cliente.')
  }

  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )

  // Llamar al repositorio mapeando las variables camelCase a las claves snake_case esperadas
  return await customerRepository.updateDetailsCustomer({
    customer_id: customerId,
    name_customer: nameCustomer,
    email_customer: emailCustomer,
    phone_customer: phoneCustomer,
    birthdate_customer: birthdateCustomer
  })
}
