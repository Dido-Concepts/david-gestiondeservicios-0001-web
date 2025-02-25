'use client'
import React from 'react'
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

  return (
    <div className="flex gap-8 p-8">
      {sections.map((section) => (
        <div key={section.title} className="w-1/2">
          {/* Encabezado de sección con título y ActionMenuCategory */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <ActionMenuCategory categoryName={section.title} />
          </div>
          {/* Lista de servicios */}
          <ul className="border border-gray-300 rounded-md shadow-md p-4 bg-white">
            {section.services.map((item) => (
              <li
                key={item}
                className="p-2 border-b last:border-b-0 cursor-default hover:bg-gray-100 flex justify-between items-center"
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
