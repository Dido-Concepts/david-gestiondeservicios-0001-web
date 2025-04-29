'use client'

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
import { changeStatusCustomer } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

export function ActionMenuCustomer ({ row }: { row: Row<CustomerModel> }) {
  const customer = row.original
  const statusToChangeTo: CustomerStatus =
    customer.status === 'active' ? 'blocked' : 'active'
  const actionLabel = customer.status === 'active' ? 'Bloquear' : 'Activar'

  const { toast } = useToast()
  const queryClient = getQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (customerId: string) => changeStatusCustomer(customerId),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el estado del cliente.'
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers]
      })
      toast({
        title: 'Estado Actualizado',
        description: data || `El estado del cliente ${customer.email} ha sido actualizado a ${statusToChangeTo}.`
      })
    }
  })

  // Función que se ejecuta al hacer clic en la opción del menú
  const handleChangeStatus = () => {
    // Llama a la mutación pasando el ID del cliente CONVERTIDO A STRING
    mutate(String(customer.id)) // <--- CORRECCIÓN APLICADA AQUÍ
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isPending
          ? (
            <Button variant="ghost" className='h-8 w-8 p-0' disabled>
              <span className="sr-only">Cargando...</span>
              <IconComponent name="spinner" className="animate-spin h-4 w-4" />
            </Button>
            )
          : (
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleChangeStatus}
          disabled={isPending}
        >
          {actionLabel}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled={isPending}>Editar</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-red-600" disabled={isPending}>Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
