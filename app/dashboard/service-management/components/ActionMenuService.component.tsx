'use client'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'
import EditModalService from '@/app/dashboard/service-management/components/EditModalService.component'

const ActionMenuService = () => {
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Datos iniciales del servicio (pueden venir de props o de una API)
  const [serviceData, setServiceData] = useState({
    serviceName: 'Corte de cabello',
    duration: '30 minutos',
    price: '20',
    category: 'cabello'
  })

  // Lógica para guardar cambios del modal
  const handleSave = (updatedData: typeof serviceData) => {
    console.log('Servicio Actualizado:', updatedData)
    setServiceData(updatedData)
  }

  const handleEdit = () => {
    setEditModalOpen(true) // Abre el modal al seleccionar "Editar"
  }

  return (
    <>
      <DropdownMenu>
        {/* Botón de ícono */}
        <DropdownMenuTrigger asChild>
          <div
            className="p-1 rounded-md hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2"
            role="button"
            aria-label="Action Menu"
          >
            <IconComponent
              name="ellipsis"
              width={20}
              height={20}
              className="w-5 h-5 ml-2"
            />
          </div>
        </DropdownMenuTrigger>

        {/* Opciones del menú */}
        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="bg-white border border-gray-200 rounded-md shadow-md w-40"
        >
          <DropdownMenuItem onSelect={handleEdit}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log('Cambiar estado')}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de edición */}
      <EditModalService
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        serviceData={serviceData}
        onSave={handleSave}
      />
    </>
  )
}

export default ActionMenuService
