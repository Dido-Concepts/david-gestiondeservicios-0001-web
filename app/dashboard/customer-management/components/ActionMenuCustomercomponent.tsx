// 'use client'
// import React, { useState } from 'react'
// import EditModalCustomer from '@/app/dashboard/customer-management/components/EditModalCustomer.component'
// import DeleteModalCustomer from '@/app/dashboard/customer-management/components/DeleteModalCustomer.component'
// import BlockModalCustomer from '@/app/dashboard/customer-management/components/BlockModalCustomer.component'
// import { IconComponent } from '@/app/components/Icon.component'

// // Definir la interfaz Customer dentro del mismo archivo
// interface Customer {
//   id: number
//   fullName: string
//   phone: string
//   email: string
//   registrationDate: string
//   // countryCode: string
//   birthDate: string
// }

// const ActionMenu = ({ customer }: { customer: Customer }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//   const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

//   const toggleMenu = (event: React.MouseEvent) => {
//     event.stopPropagation()
//     setIsOpen(!isOpen)
//   }

//   const handleAction = (action: string) => {
//     if (action === 'Editar') {
//       setIsEditModalOpen(true)
//     } else if (action === 'Eliminar') {
//       setIsDeleteModalOpen(true)
//     } else if (action === 'Bloquear') {
//       setIsBlockModalOpen(true)
//     }
//     setIsOpen(false)
//   }

//   const handleDelete = () => {
//     console.log(`Cliente eliminado: ${customer.fullName}`)
//     setIsDeleteModalOpen(false)
//   }

//   const handleBlock = (reason: string) => {
//     console.log(`Cliente bloqueado: ${customer.fullName} por motivo: ${reason}`)
//     setIsBlockModalOpen(false)
//   }

//   return (
//     <div className="relative">
//       {/* Botón de ellipsis (⋮) */}
//       <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-800">
//         <IconComponent name="ellipsis" width={20} height={20} className="w-6 h-6 ml-2" />
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 text-start mt-2 w-32 bg-white border border-gray-300 shadow-md rounded-md z-50">
//           <ul className="py-1 text-sm text-gray-700">
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Editar')}>
//               Editar
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Eliminar')}>
//               Eliminar
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAction('Bloquear')}>
//               Bloquear
//             </li>
//           </ul>
//         </div>
//       )}

//       {/* Modal de Edición */}
//       <EditModalCustomer
//         isOpen={isEditModalOpen}
//         onClose={() => setIsEditModalOpen(false)}
//         customerData={customer}
//       />

//       {/* Modal de Eliminación */}
//       <DeleteModalCustomer
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onDelete={handleDelete}
//       />

//       {/* Modal de Bloqueo */}
//       <BlockModalCustomer
//         isOpen={isBlockModalOpen}
//         onClose={() => setIsBlockModalOpen(false)}
//         onBlock={handleBlock}
//       />
//     </div>
//   )
// }

// export default ActionMenu

import { IconComponent } from '@/app/components'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  CustomerModel,
  CustomerStatus
} from '@/modules/customer/domain/models/customer.model'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { changeStatus } from '@/modules/user/infra/actions/user.action'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

export function ActionMenuCustomer ({ row }: { row: Row<CustomerModel> }) {
  const changeStatusWithMutation: CustomerStatus =
    row.original.status === 'active' ? 'blocked' : 'active'

  const { toast } = useToast()

  // Implementar la función de cambio de estado con la action de Customer
  //! Este no es el correcto
  const { isPending } = useMutation({
    mutationFn: changeStatus,
    onError: (error) => {
      return toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to updated'
      })
    },
    onSuccess: () => {
      const queryClient = getQueryClient()
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers]
      })
      toast({
        title: 'Usuario actualizado',
        description: `El usuario ${row.original.email} ha sido ${changeStatusWithMutation}`
      })
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isPending
          ? (
          <Button variant="ghost" disabled>
            <span className="sr-only">Cargando...</span>
            <IconComponent name="spinner" className="animate-spin h-4 w-4" />
          </Button>
            )
          : (
          <Button variant="ghost">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
            )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          {row.original.status === 'active' ? 'Bloquear ' : 'Activar '}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
