'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface EditModalServiceProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  serviceData: {
    serviceName: string
    duration: string
    price: string
    category: string
  }
  onSave: (updatedData: {
    serviceName: string
    duration: string
    price: string
    category: string
  }) => void
}

const EditModalService: React.FC<EditModalServiceProps> = ({
  open,
  onOpenChange,
  serviceData,
  onSave
}) => {
  const [serviceName, setServiceName] = useState(serviceData.serviceName)
  const [duration, setDuration] = useState(serviceData.duration)
  const [price, setPrice] = useState(serviceData.price)
  const [category, setCategory] = useState(serviceData.category)

  // Actualiza los campos si el servicio cambia
  useEffect(() => {
    setServiceName(serviceData.serviceName)
    setDuration(serviceData.duration)
    setPrice(serviceData.price)
    setCategory(serviceData.category)
  }, [serviceData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ serviceName, duration, price, category })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
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
          <Button type="submit" className="w-full">Guardar Cambios</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditModalService
