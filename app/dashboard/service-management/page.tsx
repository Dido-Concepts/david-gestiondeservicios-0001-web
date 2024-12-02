import React, { useState } from 'react'
import AddButtonService from '@/app/dashboard/service-management/components/AddButtonService.component'
import ServiceModal from '@/app/dashboard/service-management/components/ServiceModal.component'
import DynamicTable from '@/app/components/table/dynamicTable.component'
import { data } from './mock/servicio.mock'

export default function ServicioManagementPage () {
  const [servicios, setServicios] = useState(data)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  const handleAddService = () => {
    setModalOpen(true)
    setSelectedService(null)
  }

  const handleEditService = (service: any) => {
    setModalOpen(true)
    setSelectedService(service)
  }

  const handleModalSubmit = (newService: any) => {
    setServicios((prev) => [...prev, newService])
    setModalOpen(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Gestionar Servicios</h1>
        <AddButtonService onAddService={handleAddService} onAddCategory={() => console.log('Añadir Categoría')} />
      </div>

      <DynamicTable
        droppableId="servicios"
        group="servicios"
        headerData={[
          { label: 'Servicio', key: 'servicio' },
          { label: 'Duración', key: 'duracion' },
          { label: 'Precio', key: 'precio' }
        ]}
        data={servicios}
        onAction={(type, item) => {
          if (type === 'edit') handleEditService(item)
          else console.log('Delete', item)
        }}
        onDragUpdate={(updatedData) => setServicios(updatedData)}
      />

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        serviceData={selectedService}
      />
    </div>
  )
}
