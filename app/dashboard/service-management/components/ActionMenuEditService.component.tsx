'use client'

import { IconComponent } from '@/app/components'
import DeleteModal from '@/app/components/DeleteModal.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { deleteService } from '@/modules/service/application/actions/service.action'
import { ServiceModel } from '@/modules/service/domain/models/service.model'
import { useModalService } from '@/modules/service/infra/store/service-modal.store'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export function ActionMenuEditService ({ service }: { service: ServiceModel }) {
  const { setService, toggleModal } = useModalService()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = getQueryClient()

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (serviceId: number) => deleteService({ service_id: serviceId }),
    onError: (error) => {
      // Muestra notificación de error
      toast({
        variant: 'destructive',
        title: 'Error al Eliminar',
        description: error instanceof Error ? error.message : 'Ocurrió un error al intentar eliminar el servicio.'
      })
    },
    onSuccess: (data) => {
      // Invalida la caché de la lista de clientes para que se refresque la tabla
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices]
      })
      // Muestra notificación de éxito
      toast({
        title: 'Servicio Eliminado',
        description: data || `El servicio ${service.name} ha sido eliminado.`
      })
      // Cierra el modal de confirmación
      setIsDeleteDialogOpen(false)
    }
  })

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleEditService = () => {
    setService(service)
    toggleModal()
  }

  const handleDeleteClick = () => {
    if (isDeleting) return
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (isDeleting) return
    mutateDelete(Number(service.id))
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
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
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleEditService}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleConfirmDelete}
      />
    </>
  )
}

export default ActionMenuEditService
