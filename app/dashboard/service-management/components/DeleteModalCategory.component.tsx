'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteModalCategoryProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  onConfirm: () => void
}

const DeleteModalCategory: React.FC<DeleteModalCategoryProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar Categoría</DialogTitle>
        </DialogHeader>
        <div className="text-gray-700">
          ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)} // Cierra el modal
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm} // Ejecuta la función de confirmación
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModalCategory
