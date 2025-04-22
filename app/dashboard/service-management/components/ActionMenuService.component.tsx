// ActionMenuService.component.tsx
'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'
import DeleteModalService from '@/app/dashboard/service-management/components/DeleteModalService.component'

interface ActionMenuServiceProps {
  onEdit: () => void;
  serviceName: string;
}

const ActionMenuService: React.FC<ActionMenuServiceProps> = ({
  onEdit,
  serviceName
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleDelete = () => {
    console.log('Servicio eliminado:', serviceName)
    setDeleteModalOpen(false)
    setIsDropdownOpen(false) // Cerrar el dropdown al eliminar
  }

  const handleDeleteModal = () => {
    setDeleteModalOpen(true)
    setIsDropdownOpen(false) // Cerrar el dropdown al abrir el modal de eliminación
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown} >
        <DropdownMenuTrigger asChild>
          <div
            className="p-1 rounded-md hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2"
            role="button"
            aria-label="Action Menu"
            onClick={toggleDropdown}
          >
            <IconComponent
              name="ellipsis"
              width={20}
              height={20}
              className="w-5 h-5 ml-2"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="bg-white border border-gray-200 rounded-md shadow-md w-40"
        >
          <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem> {/* Ejecuta onEdit al hacer clic */}
          <DropdownMenuItem onClick={handleDeleteModal}>Eliminar</DropdownMenuItem> {/* Abre el modal de eliminación */}
        </DropdownMenuContent>
      </DropdownMenu>

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
