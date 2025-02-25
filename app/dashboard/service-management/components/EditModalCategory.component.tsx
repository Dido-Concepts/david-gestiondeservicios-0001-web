'use client'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface EditModalCategoryProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  categoryData: { categoryName: string }
  onSave: (updatedCategory: { categoryName: string }) => void
}

const EditModalCategory: React.FC<EditModalCategoryProps> = ({
  open,
  onOpenChange,
  categoryData,
  onSave
}) => {
  const [categoryName, setCategoryName] = useState(categoryData.categoryName)

  // Actualiza el input si los datos de la categoría cambian
  useEffect(() => {
    setCategoryName(categoryData.categoryName)
  }, [categoryData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ categoryName })
    onOpenChange(false) // Cierra el modal después de guardar
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el DropdownMenu
      >
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre de la Categoría</Label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditModalCategory
