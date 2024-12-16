'use client'
import React from 'react'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import ActionMenuService from '@/app/dashboard/service-management/components/ActionMenuService.component'

export default function DynamicTable () {
  const hairServices = [
    'Corte de cabello - Adulto/Niño',
    'Ondulación Permanente'
  ]
  const beardServices = ['Ritual de Barba', 'Tinturación de Barba']

  const [hairList, hairItems] = useDragAndDrop<HTMLUListElement, string>(
    hairServices,
    { group: 'services' }
  )
  const [beardList, beardItems] = useDragAndDrop<HTMLUListElement, string>(
    beardServices,
    { group: 'services' }
  )

  return (
    <div className="flex gap-8 p-8">
      {/* Hair Services Table */}
      <div className="w-1/2">
        <h2 className="text-lg font-bold mb-4">Cabello</h2>
        <ul
          ref={hairList}
          className="border border-gray-300 rounded-md shadow-md p-4 bg-white"
        >
          {hairItems.map((item) => (
            <li
              key={item}
              className="p-2 border-b last:border-b-0 cursor-move hover:bg-gray-100"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Beard Services Table */}
      <div className="w-1/2">
        <h2 className="text-lg font-bold mb-4">Barba</h2>
        <ul
          ref={beardList}
          className="border border-gray-300 rounded-md shadow-md p-4 bg-white"
        >
          {beardItems.map((item) => (
            <li
              key={item}
              className="p-2 border-b last:border-b-0 cursor-move hover:bg-gray-100 flex justify-between items-center"
            >
              <span>{item}</span>
              <ActionMenuService/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
//
