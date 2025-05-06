'use client'

import { CustomerModel } from '@/modules/customer/domain/models/customer.model'
import { ColumnDef } from '@tanstack/react-table'
import { ActionMenuCustomer } from '@/app/dashboard/customer-management/components/ActionMenuCustomercomponent'

export const COLUMNS_CUSTOMER_MANAGEMENT: ColumnDef<CustomerModel>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre y Apellidos'
  },
  {
    accessorKey: 'email',
    header: 'Correo'
  },
  {
    accessorKey: 'phone',
    header: 'Celular'
  },
  {
    accessorKey: 'birthDate',
    header: 'Cumpleaños',
    cell: ({ row }) => {
      const date = new Date(row.original.birthDate)
      const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      return (
        <span>
          {formattedDate}
        </span>
      )
    }
  },
  {
    // Refactor: Averiguar como usar enums de forma correcta en este punto
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      return (
        <span className={`rounded-full 
          px-2 py-1 
          text-xs 
          font-semibold ${row.original.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {row.original.status === 'active' ? 'Activo' : 'Bloqueado'}
        </span>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de registro',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      return (
        <span>
          {formattedDate}
        </span>
      )
    }
  },
  {
    id: 'actions',
    size: 5,
    cell: ({ row }) => {
      return (
        <ActionMenuCustomer row={row} />
      )
    }
  }
]
