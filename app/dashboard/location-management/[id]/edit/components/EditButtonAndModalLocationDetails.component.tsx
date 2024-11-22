'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function EditButtonAndModalLocationDetails () {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => setIsModalOpen(true)

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        className="text-app-secondary font-medium hover:underline"
        onClick={handleModalOpen}
      >
        Editar
      </button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">Editar datos de la sede</DialogTitle>
            <DialogDescription className="text-gray-500 font-bold">
              Modifica los datos de la sede según sea necesario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 font-semibold">
            <div>
              <label>Nombre de la sede</label>
              <Input defaultValue="Loreto" placeholder="" />
            </div>
            <div>
              <label>Teléfono</label>
              <Input defaultValue="995864235" placeholder="" />
            </div>
            <div>
              <label>Dirección</label>
              <Input defaultValue="Av. de la Constitución 504" placeholder="" />
            </div>
            <div>
              <label>Imagen del centro</label>
              <Input type="file" accept="image/png, image/jpeg" />
            </div>
            <Button className="mt-4 w-full font-bold">
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
