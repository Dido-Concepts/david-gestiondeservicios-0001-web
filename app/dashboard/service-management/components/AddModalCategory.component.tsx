'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AddModalCategory () {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para guardar la categoría
    console.log({ categoryName })
    setOpen(false)
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }

  return (
    <>
      <Button
        variant="ghost"
        className="w-full text-left hover:bg-gray-100 px-2 py-1.5"
        onClick={handleOpenModal}
      >
        Categoría
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el DropdownMenu
        >
          <DialogHeader>
            <DialogTitle>Agregar Nueva Categoría</DialogTitle>
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
              Guardar Categoría
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
