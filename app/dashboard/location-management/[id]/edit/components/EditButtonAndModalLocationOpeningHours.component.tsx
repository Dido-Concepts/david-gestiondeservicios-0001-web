'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus } from 'lucide-react'

export function EditButtonAndModalLocationOpeningHours () {
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
        <DialogContent className="px-12">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">Editar horario de atención</DialogTitle>
            <DialogDescription className="text-gray-500 font-bold">
              Configura los horarios de atención para cada día
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <Checkbox />
                <span className="w-20">{day}</span>
                <Input type="time" defaultValue="09:00" className="w-24" />
                <span>-</span>
                <Input type="time" defaultValue="19:00" className="w-24" />
                <Button variant="outline" size="icon" className="ml-2">
                  <Plus />
                </Button>
              </div>
            ))}
            <Button className="mt-4 w-full">
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
