'use server'

import container from '@/config/di/container'
import { ServiceRepository } from '@/modules/service/domain/repositories/service.repository'
import { SERVICE_MODULE_TYPES } from '@/modules/service/domain/types-module/service-types.module'

export async function createService (params: {
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.createService(params)
}

export async function updateService (params: {
    service_id: number;
    service_name: string;
    category_id: number;
    price: number;
    duration: number;
    description?: string;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.updateService(params)
}

export async function deleteService (params: {
    service_id: number;
}) {
  const serviceRepository = container.get<ServiceRepository>(
    SERVICE_MODULE_TYPES.ServiceRepository
  )
  return await serviceRepository.deleteService(params)
}
