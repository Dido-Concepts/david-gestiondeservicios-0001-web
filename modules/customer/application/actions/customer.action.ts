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
  const emailCustomer = formData.get('email_customer') as string
  const phoneCustomer = formData.get('phone_customer') as string
  const birthdateCustomer = formData.get('birthdate_customer') as string

  // Verificamos campos obligatorios según repositorio
  if (!nameCustomer) {
    throw new Error('El nombre del cliente es obligatorio')
  }

  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )

  // Asegurarnos de que todos los campos estén definidos y tengan un formato válido
  const customerDataForRepo = {
    name_customer: nameCustomer,
    email_customer: emailCustomer || '', // Asegurar que no sea null/undefined
    phone_customer: phoneCustomer || '',
    birthdate_customer: birthdateCustomer || '',
    status_customer: 'active' as const // Campo obligatorio
  }

  // Log para diagnóstico
  // console.log('>>> Enviando al Backend API (Crear Cliente): Payload:')
  // console.log(JSON.stringify(customerDataForRepo, null, 2))

  try {
    return await customerRepository.createCustomer(customerDataForRepo)
  } catch (error: unknown) {
    // Tipamos error correctamente para evitar el uso de 'any'
    if (error instanceof Error) {
      console.error('Error al crear cliente:', error.message)
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as { response?: { data?: unknown } }
      console.error('Error al crear cliente:',
        errorObj.response?.data || 'Error desconocido')
    } else {
      console.error('Error al crear cliente:', error)
    }
    throw error
  }
}

export async function updateDetailsCustomer (formData: FormData) {
  // Extraer datos del FormData usando el formato snake_case consistente
  const customerId = formData.get('id') as string
  const nameCustomer = formData.get('name_customer') as string
  const emailCustomer = formData.get('email_customer') as string | null
  const phoneCustomer = formData.get('phone_customer') as string | null
  const birthdateCustomer = formData.get('birthdate_customer') as string | null

  if (!customerId || !nameCustomer) {
    throw new Error('Faltan datos requeridos para actualizar el cliente.')
  }

  const customerRepository = container.get<CustomerRepository>(
    CUSTOMER_MODULE_TYPES.CustomerRepository
  )

  // Construir objeto con todos los campos requeridos por el repositorio
  // Proporcionar valores vacíos para los campos opcionales si no están presentes
  const customerData = {
    id: customerId,
    name_customer: nameCustomer,
    email_customer: emailCustomer || '', // Siempre proporcionar un string
    phone_customer: phoneCustomer || '', // Siempre proporcionar un string
    birthdate_customer: birthdateCustomer || '' // Siempre proporcionar un string
  }

  // Llamar al repositorio con los datos
  return await customerRepository.updateDetailsCustomer(customerData)
}

export async function createCustomerWithAllFields (data: {
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  birthdate_customer: string;
}) {
  // Verificamos campos obligatorios según repositorio
  if (!data.name_customer) {
    throw new Error('El nombre del cliente es obligatorio')
  }

  // Crear FormData para creación con todos los campos requeridos
  const formData = new FormData()
  formData.append('name_customer', data.name_customer)

  // Siempre incluir estos campos, aunque estén vacíos
  formData.append('email_customer', data.email_customer || '')
  formData.append('phone_customer', data.phone_customer || '')
  formData.append('birthdate_customer', data.birthdate_customer || '')
  // Añadir estado por defecto
  formData.append('status_customer', 'active')

  const result = await createCustomer(formData)

  return {
    id: typeof result === 'number' ? result : 0,
    name_customer: data.name_customer
  }
}
//
