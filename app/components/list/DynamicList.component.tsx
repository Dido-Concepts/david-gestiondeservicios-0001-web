// DynamicList.component.tsx
'use client'
import React from 'react'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import ActionMenuService from '@/app/dashboard/service-management/components/ActionMenuService.component'
import ActionMenuCategory from '@/app/dashboard/service-management/components/ActionMenuCategory.component'
import EditModalService from '@/app/dashboard/service-management/components/EditModalService.component' // Importa el modal de edición

interface Service {
  name: string;
}

interface Category {
  title: string;
  services: Service[];
}

export default function DynamicTable () {
  // Datos de las secciones
  const [sections, setSections] = React.useState<Category[]>([
    {
      title: 'Cabello',
      services: [{ name: 'Corte de cabello - Adulto/Niño' }, { name: 'Ondulación Permanente' }]
    },
    {
      title: 'Barba',
      services: [{ name: 'Ritual de Barba' }, { name: 'Tinturación de Barba' }]
    }
  ])

  // Estados para el drag and drop de cada sección
  const [hairList, hairItems] = useDragAndDrop<HTMLUListElement, Service>(
    sections[0].services,
    {
      group: 'services'
    }
  )

  const [beardList, beardItems] = useDragAndDrop<HTMLUListElement, Service>(
    sections[1].services,
    {
      group: 'services'
    }
  )

  // Combina los resultados en un array para mapear después
  const dragAndDropData = [
    { title: sections[0].title, listRef: hairList, items: hairItems },
    { title: sections[1].title, listRef: beardList, items: beardItems }
  ]

  // Estado para controlar el modal de edición y el servicio a editar
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [serviceToEdit, setServiceToEdit] = React.useState<{ serviceName: string; duration: string; price: string; category: string } | null>(null)
  const [currentCategoryTitle, setCurrentCategoryTitle] = React.useState<string | null>(null)

  const handleEditService = (service: Service, categoryTitle: string) => {
    console.log('handleEditService called for:', service.name) // Verifica si se llama
    setServiceToEdit({ serviceName: service.name, duration: '', price: '', category: categoryTitle })
    setCurrentCategoryTitle(categoryTitle)
    setEditModalOpen(true)
    console.log('editModalOpen state:', editModalOpen) // Verifica el estado después de actualizar
  }

  const handleSaveService = (updatedService: { serviceName: string; duration: string; price: string; category: string }) => {
    setSections(prevSections =>
      prevSections.map(category =>
        category.title === currentCategoryTitle
          ? {
              ...category,
              services: category.services.map(s =>
                s.name === serviceToEdit?.serviceName ? { name: updatedService.serviceName } : s
              )
            }
          : category
      )
    )
    setEditModalOpen(false)
    setServiceToEdit(null)
    setCurrentCategoryTitle(null)
  }

  return (
    <div className="flex gap-8 p-8">
      {dragAndDropData.map((section) => (
        <div key={section.title} className="w-1/2">
          {/* Contenedor flexible para alinear el título y el ActionMenuCategory */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <ActionMenuCategory categoryName={section.title} />
          </div>
          <ul
            ref={section.listRef}
            className="border border-gray-300 rounded-md shadow-md p-4 bg-white"
          >
            {section.items.map((item) => (
              <li
                key={item.name}
                className="p-2 border-b last:border-b-0 cursor-move hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{item.name}</span>
                <ActionMenuService
                  onEdit={() => handleEditService(item, section.title)}
                  serviceName={item.name}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Modal de edición */}
      {editModalOpen && ( // Renderiza solo si editModalOpen es true
        <EditModalService
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          serviceData={serviceToEdit || { serviceName: '', duration: '', price: '', category: '' }} // Asegúrate de que serviceToEdit tenga un valor inicial
          onSave={handleSaveService}
        />
      )}
    </div>
  )
}
