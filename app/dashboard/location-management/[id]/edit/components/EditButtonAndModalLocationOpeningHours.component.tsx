'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { ListOfSchedules } from '../../../components/ListOfSchedules.component'

export function EditButtonAndModalLocationOpeningHours () {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => setIsModalOpen(true)

  return (
    <>

      <button
        className="text-app-secondary font-medium hover:underline"
        onClick={handleModalOpen}
      >
        Editar
      </button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="px-12 max-h-[80vh] overflow-y-auto">

          <ListOfSchedules title='Editar horario de atención' description='Configura los horarios de atención para cada día' />
        </DialogContent>
      </Dialog>
    </>
  )
}
