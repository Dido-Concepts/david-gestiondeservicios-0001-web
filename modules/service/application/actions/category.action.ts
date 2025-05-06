'use server'

import container from '@/config/di/container'
import { CategoryRepository } from '@/modules/service/domain/repositories/category.repository'
import { CATEGORY_MODULE_TYPES } from '@/modules/service/domain/types-module/service-types.module'

export async function getCategories (params: {
    location: string;
  }) {
  const categoryRepository = container.get<CategoryRepository>(
    CATEGORY_MODULE_TYPES.CategoryRepository
  )
  return await categoryRepository.getCategory({ location: params.location })
}

export async function createCategory (params: {
    name_category: string;
    description_category: string;
    location_id: number;
  }) {
  const categoryRepository = container.get<CategoryRepository>(
    CATEGORY_MODULE_TYPES.CategoryRepository
  )
  return await categoryRepository.createCategory(params)
}

export async function updateCategory (params: {
    id: number;
    name_category: string;
    description_category: string;
    location_id: number;
  }) {
  const categoryRepository = container.get<CategoryRepository>(
    CATEGORY_MODULE_TYPES.CategoryRepository
  )
  return await categoryRepository.updateCategory(params)
}

export async function deleteCategory (params: {
    id: number;
  }) {
  const categoryRepository = container.get<CategoryRepository>(
    CATEGORY_MODULE_TYPES.CategoryRepository
  )
  return await categoryRepository.deleteCategory(params)
}
