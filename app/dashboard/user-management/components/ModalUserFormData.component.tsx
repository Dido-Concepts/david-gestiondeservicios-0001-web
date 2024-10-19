'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'

export function ModalUserFormData () {
  const { isModalOpen, toggleModal } = useModalUserForm()
  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
    <DialogContent className="sm:max-w-[425px] bg-app-primary text-white">
      <DialogHeader>
        <DialogTitle className="text-white">Editar perfil</DialogTitle>
        <DialogDescription className="text-gray-300">
          Haz cambios en tu perfil aquí. Haz clic en guardar cuando hayas terminado.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">

      </div>
      <DialogFooter>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Guardar cambios</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}
