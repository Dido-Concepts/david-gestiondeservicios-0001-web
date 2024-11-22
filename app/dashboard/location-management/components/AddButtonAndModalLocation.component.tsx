'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus } from 'lucide-react'
import { IconComponent } from '@/app/components'

export function AddButtonAndModalLocation () {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('datos-de-la-sede')
  const [isHorarioDisabled, setIsHorarioDisabled] = useState(true)

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
        <DialogContent className="max-w-lg">
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
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold">Añadir horario de atención</DialogTitle>
                <DialogDescription className="text-gray-500 font-bold">
                  Completa los horarios de atención para cada día
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
                <Button className="mt-4 w-full">Guardar</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
