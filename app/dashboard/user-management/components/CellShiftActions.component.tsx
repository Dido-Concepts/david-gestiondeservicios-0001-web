'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import AddModalShift from '@/app/dashboard/user-management/components/AddModalShift.component'
import AddModalShiftFree from '@/app/dashboard/user-management/components/AddModalShiftFree.component'
import { UserLocationEvent } from '@/modules/user-location/domain/repositories/user-location.repository'

interface CellShiftActionsProps {
  shift: string
  employeeName: string
  selectedDate: string
  userId: number
  dayOffEvent?: UserLocationEvent
}

const CellShiftActions = ({
  shift,
  employeeName,
  selectedDate,
  userId
}: CellShiftActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddFreeModalOpen, setIsAddFreeModalOpen] = useState(false)

  // Analizar el estado de la celda para determinar las opciones disponibles
  const isNoShift = shift === 'Sin turno'
  const isPartialDayOff = shift.startsWith('No disponible') && shift.includes('\n')
  const isFullDayOff = shift.startsWith('No disponible') && !shift.includes('\n')
  const hasShift = shift.match(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/) // Formato "09:00 - 17:00"

  // Determinar qué opciones mostrar basado en lógica simple
  const getAvailableOptions = () => {
    const options = []

    if (isNoShift) {
      // Sin turno: puede añadir turno o día libre
      options.push(
        { label: 'Añadir turno', action: () => setIsAddModalOpen(true) },
        { label: 'Añadir día libre', action: () => setIsAddFreeModalOpen(true) }
      )
    } else if (isPartialDayOff) {
      // Día libre parcial: puede añadir turno en horario disponible restante
      options.push(
        { label: 'Añadir turno', action: () => setIsAddModalOpen(true) }
      )
    } else if (hasShift) {
      // Tiene turno: puede añadir día libre
      options.push(
        { label: 'Añadir día libre', action: () => setIsAddFreeModalOpen(true) }
      )
    } else if (isFullDayOff) {
      // Día libre completo: puede añadir otro día libre (extender o modificar)
      options.push(
        { label: 'Añadir día libre', action: () => setIsAddFreeModalOpen(true) }
      )
    }

    return options
  }

  const options = getAvailableOptions()

  // Si no hay opciones disponibles, no mostrar el botón
  if (options.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        title="Añadir nueva opción"
      >
        <Plus size={12} />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop para cerrar el dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute z-20 left-0 mt-1 w-40 bg-white border border-gray-300 shadow-lg rounded-md">
            <ul className="py-1 text-sm">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    option.action()
                    setIsDropdownOpen(false)
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Modales */}
      <AddModalShift
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        employeeName={employeeName}
        selectedDate={selectedDate}
        userId={userId}
      />

      <AddModalShiftFree
        isOpen={isAddFreeModalOpen}
        onClose={() => setIsAddFreeModalOpen(false)}
        employeeName={employeeName}
        selectedDate={selectedDate}
        userId={userId}
      />
    </div>
  )
}

export default CellShiftActions
