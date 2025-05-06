// DynamicList.component.tsx
'use client'
import { getCategories } from '@/modules/service/application/actions/category.action'
// Asumiendo que CategoryModel existe y se importa así:
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { ServiceModel } from '@/modules/service/domain/models/service.model'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { IconComponent } from '@/app/components'
import ActionMenuEditCategory from '@/app/dashboard/service-management/components/ActionMenuEditCategory.component'
import ActionMenuEditService from '@/app/dashboard/service-management/components/ActionMenuEditService.component'

interface CategoryServiceListProps {
  initialServices: ServiceModel[];
  groupId: string;
  categoryId: string;
}

export const CategoryServiceList: React.FC<CategoryServiceListProps> = ({
  initialServices,
  groupId,
  categoryId
}) => {
  const [parentRef, services] = useDragAndDrop<HTMLUListElement, ServiceModel>(
    initialServices,
    {
      group: groupId,
      selectedClass: 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300'
    }
  )

  return (
    <ul
      ref={parentRef}
      className="list-none m-0 p-3 min-h-[80px] bg-white border border-dashed border-gray-300 rounded-md space-y-2"
      data-category-id={categoryId}
    >
      {services.map((service) => (
        <li
          key={service.id}
          className="bg-blue-50 border border-blue-200 px-3 py-2 rounded cursor-grab flex justify-between items-center text-sm transition-colors duration-150 ease-in-out hover:bg-blue-100"
          data-service-id={service.id}
        >

          <span className="font-medium text-blue-800 flex items-center gap-2">
            <IconComponent
              name="fluent:glance-horizontal-sparkles-24-filled"
              width={15}
              height={15}
              className="ml-2"
            />
            {service.name}</span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700">
              (S/ {service.price.toFixed(2)} - {service.duration ?? '?'} Hora(s))
            </span>
            <ActionMenuEditService />
          </div>
        </li>
      ))}
      {services.length === 0 && (
        <li className="p-5 text-center text-gray-400 italic text-sm">
          Arrastra servicios aquí
        </li>
      )}
    </ul>
  )
}

export default function DynamicTable ({ locationFilter }: { locationFilter: string }) {
  const { data: initialCategoriesData = [] } = useSuspenseQuery<CategoryModel[]>({
    queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices, locationFilter],
    queryFn: () =>
      getCategories({ location: locationFilter })
  })

  const serviceDragGroup = 'all-service-categories'

  return (
    <div className="p-5 font-sans">

      {/* Cambiado de flex flex-wrap a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* <-- MODIFICACIÓN AQUÍ */}
        {initialCategoriesData.length > 0
          ? (
              initialCategoriesData.map((category) => (
              // Removido flex-1, ya no es necesario con grid
              <div
                key={category.id}
                // className="flex-1 min-w-[280px] bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm" <-- Clase Original
                className="min-w-[280px] bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm" // <-- MODIFICACIÓN AQUÍ (quitado flex-1)
              >
                <div className="text-lg font-semibold mb-2 pb-2 border-b border-gray-200 text-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent
                      name="mdi:tag-plus"
                      width={20}
                      height={20}
                      className="w-6 h-6 ml-2"
                    />
                    <span>
                      {category.name}
                    </span>
                  </div>
                  <ActionMenuEditCategory category={category} />
                </div>
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {category.description || <span className="italic text-gray-400">Sin descripción</span>}
                </p>
                <CategoryServiceList
                  categoryId={category.id}
                  initialServices={category.services}
                  groupId={serviceDragGroup}
                />
              </div>
              ))
            )
          : (
            <p className="text-gray-500 italic col-span-full text-center"> {/* Añadido col-span-full y text-center para este mensaje */}
              No se encontraron categorías.
            </p>
            )}
      </div>
    </div>
  )
}
