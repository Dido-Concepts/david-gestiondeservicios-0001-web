'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'
import EditModalService from '@/app/dashboard/service-management/components/EditModalService.component'
import DeleteModalService from '@/app/dashboard/service-management/components/DeleteModalService.component'

const ActionMenuService = () => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // Datos iniciales del servicio (pueden venir de props o de una API)
  const [serviceData, setServiceData] = useState({
    serviceName: 'Corte de cabello',
    duration: '30 minutos',
    price: '20',
    category: 'cabello'
  })

  // Lógica para guardar cambios del modal de edición
  const handleSave = (updatedData: typeof serviceData) => {
    console.log('Servicio Actualizado:', updatedData)
    setServiceData(updatedData)
  }

  // Lógica para confirmar eliminación
  const handleDelete = () => {
    console.log('Servicio eliminado:', serviceData.serviceName)
    setDeleteModalOpen(false)
  }

  const handleEdit = () => {
    setEditModalOpen(true) // Abre el modal de edición
  }

  const handleDeleteModal = () => {
    setDeleteModalOpen(true) // Abre el modal de eliminación
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            draggable={false} // Evita que el botón inicie un drag
            onDragStart={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2"
            aria-label="Action Menu"
          >
            <IconComponent
              name="ellipsis"
              width={20}
              height={20}
              className="w-5 h-5 ml-2"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            sideOffset={5}
            className="bg-white border border-gray-200 rounded-md shadow-md w-40"
          >
            <DropdownMenuItem onSelect={handleEdit}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDeleteModal}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      {/* Modal de edición */}
      <EditModalService
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        serviceData={serviceData}
        onSave={handleSave}
      />

      {/* Modal de eliminación */}
      <DeleteModalService
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default ActionMenuService
