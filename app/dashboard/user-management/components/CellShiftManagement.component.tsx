'use client'
import React, { useState } from 'react'
import AddModalShift from '@/app/dashboard/user-management/components/AddModalShift.component'
import EditModalShift from '@/app/dashboard/user-management/components/EditModalShift.component'
import DeleteModalShift from '@/app/dashboard/user-management/components/DeleteModalShift.component'
import AddModalShiftFree from '@/app/dashboard/user-management/components/AddModalShiftFree.component'
import EditModalShiftFree from '@/app/dashboard/user-management/components/EditModalShiftFree.component'

const CellShiftManagement = ({
  shift,
  id,
  openId,
  setOpenId,
  employeeName,
  selectedDate
}: {
  shift: string
  id: string
  openId: string | null
  setOpenId: (id: string | null) => void
  employeeName: string
  selectedDate: string
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddFreeModalOpen, setIsAddFreeModalOpen] = useState(false)
  const [isEditFreeModalOpen, setIsEditFreeModalOpen] = useState(false)

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenId(openId === id ? null : id)
  }

  // Verificar los casos
  const isNoShift = shift === 'Sin turno'
  const isFreeDay = shift === 'Libre'
  const hasShift = !isNoShift && !isFreeDay // Caso donde hay un turno definido (Ej. "09:00 - 19:00")

  // Función de eliminación (simulada, luego se integrará con la API)
  const handleDelete = () => {
    console.log(`Turno de ${employeeName} el ${selectedDate} eliminado`)
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="relative cell-dropdown">
      <div
        className={`text-sm p-3 font-medium text-center bg-blue-100 rounded-md cursor-pointer ${
          openId === id ? 'bg-blue-300' : ''
        }`}
        onClick={toggleDropdown}
      >
        {shift}
      </div>

      {openId === id && (
        <div className="absolute z-50 left-0 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded-md">
          <ul className="py-1 text-sm">
            {/* Caso: Si la celda tiene "Sin turno" */}
            {isNoShift && (
              <>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsAddModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Añadir turno
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsAddFreeModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Añadir día libre
                </li>
              </>
            )}

            {/* Caso: Si la celda tiene "Libre" */}
            {isFreeDay && (
              <>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setIsEditFreeModalOpen(true)}
                >
                  Editar día libre
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsDeleteModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Eliminar día libre
                </li>
              </>
            )}

            {/* Caso: Si la celda tiene un turno asignado (ejemplo: "09:00 - 19:00") */}
            {hasShift && (
              <>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsEditModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Editar turno
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsDeleteModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Eliminar turno
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setIsAddFreeModalOpen(true)
                    setOpenId(null)
                  }}
                >
                  Añadir día libre
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Modales */}
      <AddModalShift
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        employeeName={employeeName}
        selectedDate={selectedDate}
      />

      <EditModalShift
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeName={employeeName}
        selectedDate={selectedDate}
        shift={shift}
      />

      <DeleteModalShift
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />

      <AddModalShiftFree
        isOpen={isAddFreeModalOpen}
        onClose={() => setIsAddFreeModalOpen(false)}
        onSave={(data) => console.log('Día libre añadido', data)}
      />

      <EditModalShiftFree
        isOpen={isEditFreeModalOpen}
        onClose={() => setIsEditFreeModalOpen(false)}
        onSave={(data) => console.log('Día libre editado:', data)}
        initialData={{
          employee: employeeName,
          type: 'Vacaciones anuales',
          date: selectedDate,
          startTime: '09:00',
          endTime: '19:00'
        }}
      />
    </div>
  )
}

export default CellShiftManagement
//
