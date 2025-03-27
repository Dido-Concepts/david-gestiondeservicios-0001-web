'use client'

import { IconComponent } from '@/app/components'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { ListOfSchedules } from './ListOfSchedules.component'

export function AddButtonAndModalLocation () {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('datos-de-la-sede')
  const [isHorarioDisabled, setIsHorarioDisabled] = useState(true)
  // const { form, onSubmit, isEdit } = useFormUserManagement(toggleModal, user)

  const handleModalOpen = () => setIsModalOpen(true)

  const handleNextClick = () => {
    setIsHorarioDisabled(false)
    setActiveTab('horario-de-atencion')
  }

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        className="mt-4 md:mt-0 bg-app-quaternary hover:bg-gray-500 text-app-terciary px-4 py-2 rounded-lg flex items-center"
        onClick={handleModalOpen}
      >
        Añadir sede
        <IconComponent name="plus" width={20} height={20} className="w-6 h-6 ml-2" />
      </button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="px-12 max-h-[80vh] overflow-y-auto">
          <Tabs className="pt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="datos-de-la-sede" className="w-1/2 font-semibold text-base">
                Datos de la sede
              </TabsTrigger>
              <TabsTrigger
                value="horario-de-atencion"
                className="w-1/2 font-semibold text-base"
                disabled={isHorarioDisabled}
              >
                Horario de atención
              </TabsTrigger>
            </TabsList>

            {/* Datos de la Sede Tab */}
            <TabsContent value="datos-de-la-sede" className="px-4">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">Añadir datos de la sede</DialogTitle>
                <DialogDescription className="text-gray-500 font-bold">
                  Completa los datos de la sede
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 font-semibold">
                <div>
                  <label>Nombre de la sede</label>
                  <Input defaultValue="" placeholder="Ingrese el nombre de la sede" />
                </div>
                <div>
                  <label>Teléfono</label>
                  <Input defaultValue="" placeholder="Ingrese el teléfono" />
                </div>
                <div>
                  <label>Dirección</label>
                  <Input defaultValue="" placeholder="Ingrese la dirección" />
                </div>
                <div>
                  <label>Referencia</label>
                  <Input defaultValue="" placeholder="Ingrese la referencia de la dirección" />
                </div>
                <div>
                  <label>Imagen del centro</label>
                  <Input type="file" accept="image/png, image/jpeg" />
                </div>
                <Button onClick={handleNextClick} className="mt-4 w-full font-bold">
                  Siguiente
                </Button>
              </div>
            </TabsContent>

            {/* Horario de Atención Tab */}
            <TabsContent value="horario-de-atencion" className="px-8">
               <ListOfSchedules title='Añadir horario de atención' description='Completa los horarios de atención para cada día' />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
