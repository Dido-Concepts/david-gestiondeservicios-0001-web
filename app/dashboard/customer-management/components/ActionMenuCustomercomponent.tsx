'use client'

// Importa useState para manejar el estado del modal
import { useState } from 'react'
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
// Asegúrate de importar ambas server actions
import { changeStatusCustomer, deleteCustomer } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
// Importa el componente del modal de eliminación
import DeleteModalCustomer from './DeleteModalCustomer.component' // Ajusta esta ruta si es necesario

export function ActionMenuCustomer ({ row }: { row: Row<CustomerModel> }) {
  const customer = row.original
  // Determina el estado al que se cambiaría y la etiqueta del botón
  const statusToChangeTo: CustomerStatus =
        customer.status === 'active' ? 'blocked' : 'active'
  const actionLabel = customer.status === 'active' ? 'Bloquear' : 'Activar'

  // Estado para controlar si el modal de confirmación de borrado está abierto o cerrado
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { toast } = useToast() // Hook para mostrar notificaciones
  const queryClient = getQueryClient() // Cliente de React Query para invalidar caché

  // --- Mutación para Cambiar Estado (Existente) ---
  const { mutate: mutateChangeStatus, isPending: isChangingStatus } = useMutation({
    mutationFn: (customerId: string) => changeStatusCustomer(customerId), // Llama a la server action changeStatusCustomer
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar el estado del cliente.'
      })
    },
    onSuccess: (data) => {
      // Invalida la caché de la lista de clientes para que se refresque la tabla
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers]
      })
      toast({
        title: 'Estado Actualizado',
        description: data || `El estado del cliente ${customer.email || customer.id} ha sido actualizado a ${statusToChangeTo}.`
      })
    }
  })

  // --- Mutación para Eliminar Cliente (Nueva) ---
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId), // Llama a la server action deleteCustomer
    onError: (error) => {
      // Muestra notificación de error
      toast({
        variant: 'destructive',
        title: 'Error al Eliminar',
        description: error instanceof Error ? error.message : 'Ocurrió un error al intentar eliminar el cliente.'
      })
      // Considera si cerrar el modal aquí o dejarlo abierto para que el usuario cancele
      // setIsDeleteDialogOpen(false);
    },
    onSuccess: (data) => {
      // Invalida la caché de la lista de clientes para que se refresque la tabla
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers]
      })
      // Muestra notificación de éxito
      toast({
        title: 'Cliente Eliminado',
        description: data || `El cliente ${customer.email || customer.id} ha sido marcado como anulado.`
      })
      // Cierra el modal de confirmación
      setIsDeleteDialogOpen(false)
    }
  })

  // Estado combinado para saber si alguna operación está en curso
  const isProcessing = isChangingStatus || isDeleting

  // Función que maneja el clic en la opción "Bloquear"/"Activar"
  const handleChangeStatus = () => {
    if (isProcessing) return // Evita doble clic si ya está procesando
    mutateChangeStatus(String(customer.id)) // Ejecuta la mutación de cambio de estado
  }

  // Función que maneja el clic en la opción "Eliminar" del menú
  const handleDeleteClick = () => {
    if (isProcessing) return // Evita doble clic si ya está procesando
    setIsDeleteDialogOpen(true) // Abre el modal de confirmación
  }

  // Función que se pasa al modal y se ejecuta al confirmar la eliminación
  const handleConfirmDelete = () => {
    if (isProcessing) return // Evita doble clic si ya está procesando
    mutateDelete(String(customer.id)) // Ejecuta la mutación de eliminación
  }

  return (
        // Fragmento para devolver múltiples elementos (menú y modal)
        <>
            {/* Menú desplegable de acciones */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     {/* Muestra spinner si alguna mutación está en curso, sino el botón normal */}
                    {isProcessing
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
                    {/* Opción para cambiar estado */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleChangeStatus}
                        disabled={isProcessing} // Deshabilitado si hay operación en curso
                    >
                        {actionLabel}
                    </DropdownMenuItem>
                    {/* Opción para editar (funcionalidad pendiente) */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        disabled={isProcessing} // Deshabilitado si hay operación en curso
                        // onClick={() => { /* TODO: Implementar lógica de edición */ }}
                    >
                        Editar
                    </DropdownMenuItem>
                    {/* Opción para eliminar (abre el modal) */}
                    <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" // Estilos para opción peligrosa
                        onClick={handleDeleteClick} // Llama a la función que abre el modal
                        disabled={isProcessing} // Deshabilitado si hay operación en curso
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Renderiza el Modal de Confirmación de Borrado */}
            {/* Solo se muestra si isDeleteDialogOpen es true */}
            <DeleteModalCustomer
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)} // Función para cerrar el modal (al cancelar)
                onDelete={handleConfirmDelete} // Función para ejecutar al confirmar borrado
            />
        </>
  )
}
