'use client'

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
import { deleteCategory } from '@/modules/service/application/actions/category.action'
import { CategoryModel } from '@/modules/service/domain/models/category.model'
import { useModalCategory } from '@/modules/service/infra/store/category-modal.store'
import { QUERY_KEYS_SERVICE_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useMutation } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import DeleteModal from '@/app/components/DeleteModal.component'

export function ActionMenuEditCategory (props: { category: CategoryModel }) {
  const { setCategory, toggleModal } = useModalCategory()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = getQueryClient()

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (categoryId: number) => deleteCategory({ id: categoryId }),
    onError: (error) => {
      // Muestra notificación de error
      toast({
        variant: 'destructive',
        title: 'Error al Eliminar',
        description: error instanceof Error ? error.message : 'Ocurrió un error al intentar eliminar la categoría.'
      })
    },
    onSuccess: (data) => {
      // Invalida la caché de la lista de clientes para que se refresque la tabla
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS_SERVICE_MANAGEMENT.SMListServices]
      })
      // Muestra notificación de éxito
      toast({
        title: 'Categoría Eliminado',
        description: data || `La categoría ${props.category.name} ha sido eliminada.`
      })
      // Cierra el modal de confirmación
      setIsDeleteDialogOpen(false)
    }
  })

  const handleEditCategory = () => {
    setCategory(props.category)
    toggleModal()
  }

  const handleDeleteClick = () => {
    if (isDeleting) return
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (isDeleting) return
    mutateDelete(Number(props.category.id))
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleEditCategory}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" // Estilos para opción peligrosa
            onClick={handleDeleteClick} // Llama a la función que abre el modal
            disabled={isDeleting} >
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

export default ActionMenuEditCategory
