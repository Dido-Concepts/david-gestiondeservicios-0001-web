'use client'

import React from 'react'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { IconComponent } from '@/app/components'

interface HeaderData<T> {
  label: string
  key: keyof T
}

interface TableComponentProps<T> {
  droppableId: string // ID para el grupo de la tabla
  group: string // Grupo común para todas las tablas
  headerData: HeaderData<T>[]
  data: T[]
  onAction: (actionType: string, item: T) => void
  onDragUpdate: (updatedData: T[], droppableId: string) => void // Callback para actualizar la posición de los elementos
}

export default function DynamicTable<T> ({
  droppableId,
  group,
  headerData,
  data,
  onAction,
  onDragUpdate
}: TableComponentProps<T>) {
  // Configurar el hook de drag and drop con FormKit
  const [tableRef, tableItems] = useDragAndDrop<HTMLTableSectionElement, T>(data, {
    group,
    sortable: true, // Permitir reordenar elementos
    onChange: (updatedList) => onDragUpdate(updatedList, droppableId) // Actualiza la lista cuando se arrastra
  })

  return (
    <div className="overflow-x-auto">
      <table className="text-left w-full border-collapse">
        <tbody ref={tableRef} className="bg-white dark:bg-gray-900 w-full">
          {tableItems.length === 0
            ? (
            <tr className="w-full border-b">
              <td className="p-4 w-full text-center text-gray-500">Sin servicios</td>
            </tr>
              )
            : (
                tableItems.map((item, index) => (
              <tr key={index} className="w-full border-b kanban-item">
                {/* Columna del ícono a la izquierda */}
                <td className="p-0 w-0 text-gray-400">
                  <IconComponent name="drag" width={20} height={20} className="w-6 h-6" />
                </td>

                {/* Renderiza el resto de las columnas con los datos */}
                {headerData.map(({ key }, subIndex) => (
                  <td key={subIndex} className="p-3 w-1/4">
                    {String(item[key])}
                  </td>
                ))}

                {/* Botones de acción (editar y eliminar) */}
                <td className="p-3 text-right w-auto">
                  <button onClick={() => onAction('edit', item)} className="mx-1">
                    <IconComponent name="pencil" width={20} height={20} className="w-6 h-6 text-cyan-500" />
                  </button>
                  <button onClick={() => onAction('delete', item)} className="mx-1">
                    <IconComponent name="trash" width={20} height={20} className="w-6 h-6 text-red-500" />
                  </button>
                </td>
              </tr>
                ))
              )}
        </tbody>
      </table>
    </div>
  )
}
