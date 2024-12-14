'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AddModalService () {
  const [open, setOpen] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica para guardar el servicio
    console.log({ serviceName, duration, price, category })
    setOpen(false)
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita que el DropdownMenu se cierre al abrir el modal
    e.preventDefault()
    setOpen(true)
  }

  return (
    <>
      <Button
        variant="ghost"
        className="w-full text-left pl-0 hover:bg-gray-100  py-1.5"
        onClick={handleOpenModal}
      >
        Servicio
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el DropdownMenu
        >
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre del Servicio</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Nombre del servicio"
                required
              />
            </div>
            <div>
              <Label>Duración</Label>
              <Input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej: 30 minutos"
                required
              />
            </div>
            <div>
              <Label>Precio</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Precio del servicio"
                required
              />
            </div>
            <div>
              <Label>Categoría</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabello">Cabello</SelectItem>
                  <SelectItem value="barba">Barba</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Guardar Servicio</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
