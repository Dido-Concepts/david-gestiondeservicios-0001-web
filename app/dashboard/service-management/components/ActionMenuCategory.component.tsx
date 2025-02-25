import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { IconComponent } from '@/app/components/Icon.component'
import EditModalCategory from '@/app/dashboard/service-management/components/EditModalCategory.component'
import DeleteModalCategory from '@/app/dashboard/service-management/components/DeleteModalCategory.component'

interface ActionMenuCategoryProps {
  categoryName: string
}

const ActionMenuCategory: React.FC<ActionMenuCategoryProps> = ({ categoryName }) => {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const handleSave = (updatedData: { categoryName: string }) => {
    console.log('Categoría Actualizada:', updatedData)
  }

  const handleDelete = () => {
    console.log('Categoría Eliminada:', categoryName)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className="p-1 rounded-md hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2"
            role="button"
            aria-label="Action Menu"
          >
            <IconComponent
              name="ellipsis"
              width={20}
              height={20}
              className="w-5 h-5 ml-2"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="bg-white border border-gray-200 rounded-md shadow-md w-40"
        >
          <DropdownMenuItem onSelect={() => setEditModalOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDeleteModalOpen(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de edición */}
      <EditModalCategory
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        categoryData={{ categoryName }}
        onSave={handleSave}
      />

      {/* Modal de eliminación */}
      <DeleteModalCategory
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default ActionMenuCategory
