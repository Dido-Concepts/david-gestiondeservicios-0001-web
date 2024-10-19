'use client'

import { ListUsersResponse } from '@/modules/user/application/use-cases/query/list-users/list-users.response'
import { UserStatus } from '@/modules/user/domain/models/user.model'

import { ActionMenu } from '@/app/dashboard/user-management/components'
import { ColumnDef } from '@tanstack/react-table'

export const COLUMNS_USER_MANAGEMENT: ColumnDef<ListUsersResponse>[] = [
  {
    accessorKey: 'userName',
    header: 'Nombre y Apellidos'
  },
  {
    accessorKey: 'role.nameRole',
    header: 'Rol'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      return (
        <span className={`rounded-full 
          px-2 py-1 
          text-xs 
          font-semibold ${row.original.status === UserStatus.ACTIVE ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {row.original.status === UserStatus.ACTIVE ? 'Activo' : 'Inactivo'}
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
        <ActionMenu row={row} />
      )
    }
  }
]
