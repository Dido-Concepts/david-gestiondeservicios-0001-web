'use client'
import React from 'react'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import ActionMenuService from '@/app/dashboard/service-management/components/ActionMenuService.component'
import ActionMenuCategory from '@/app/dashboard/service-management/components/ActionMenuCategory.component'

export default function DynamicTable () {
  // Datos de las secciones
  const sections = [
    {
      title: 'Cabello',
      services: ['Corte de cabello - Adulto/Niño', 'Ondulación Permanente']
    },
    {
      title: 'Barba',
      services: ['Ritual de Barba', 'Tinturación de Barba']
    }
  ]

  // Llama a useDragAndDrop de forma explícita para cada sección
  const [hairList, hairItems] = useDragAndDrop<HTMLUListElement, string>(
    sections[0].services,
    { group: 'services' }
  )

  const [beardList, beardItems] = useDragAndDrop<HTMLUListElement, string>(
    sections[1].services,
    { group: 'services' }
  )

  // Combina los resultados en un array para mapear después
  const dragAndDropData = [
    { title: sections[0].title, listRef: hairList, items: hairItems },
    { title: sections[1].title, listRef: beardList, items: beardItems }
  ]

  return (
    <div className="flex gap-8 p-8">
      {dragAndDropData.map((section) => (
        <div key={section.title} className="w-1/2">
          {/* Contenedor flexible para alinear el título y el ActionMenuCategory */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <ActionMenuCategory categoryName={section.title} />
          </div>
          <ul
            ref={section.listRef}
            className="border border-gray-300 rounded-md shadow-md p-4 bg-white"
          >
            {section.items.map((item) => (
              <li
                key={item}
                className="p-2 border-b last:border-b-0 cursor-move hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{item}</span>
                <ActionMenuService />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
