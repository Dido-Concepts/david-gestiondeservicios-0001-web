'use client'
import React, { useState } from 'react'
import EditModalCustomer from '@/app/dashboard/customer-management/components/EditModalCustomer.component'
import DeleteModalCustomer from '@/app/dashboard/customer-management/components/DeleteModalCustomer.component'
import BlockModalCustomer from '@/app/dashboard/customer-management/components/BlockModalCustomer.component'
import { IconComponent } from '@/app/components/Icon.component'

// Definir la interfaz Customer dentro del mismo archivo
interface Customer {
  id: number
  fullName: string
  phone: string
  email: string
  registrationDate: string
  // countryCode: string
  birthDate: string
}

const ActionMenu = ({ customer }: { customer: Customer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleAction = (action: string) => {
    if (action === 'Editar') {
      setIsEditModalOpen(true)
    } else if (action === 'Eliminar') {
      setIsDeleteModalOpen(true)
    } else if (action === 'Bloquear') {
      setIsBlockModalOpen(true)
    }
    setIsOpen(false)
  }

  const handleDelete = () => {
    console.log(`Cliente eliminado: ${customer.fullName}`)
    setIsDeleteModalOpen(false)
  }

  const handleBlock = (reason: string) => {
    console.log(`Cliente bloqueado: ${customer.fullName} por motivo: ${reason}`)
    setIsBlockModalOpen(false)
  }

  return (
    <div className="relative">
      {/* Botón de ellipsis (⋮) */}
      <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-800">
        <IconComponent name="ellipsis" width={20} height={20} className="w-6 h-6 ml-2" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 text-start mt-2 w-32 bg-white border border-gray-300 shadow-md rounded-md z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Editar')}>
              Editar
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Eliminar')}>
              Eliminar
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Bloquear')}>
              Bloquear
            </li>
          </ul>
        </div>
      )}

      {/* Modal de Edición */}
      <EditModalCustomer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customerData={customer}
      />

      {/* Modal de Eliminación */}
      <DeleteModalCustomer
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />

      {/* Modal de Bloqueo */}
      <BlockModalCustomer
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onBlock={handleBlock}
      />
    </div>
  )
}

export default ActionMenu
