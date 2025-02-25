'use client'
import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteModalServiceProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  onConfirm: () => void
}

const DeleteModalService: React.FC<DeleteModalServiceProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar Servicio</DialogTitle>
        </DialogHeader>
        <div className="text-gray-700">
          ¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModalService
