'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
            <Label htmlFor="serviceName">Nombre del Servicio</Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Nombre del servicio"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ej: 30 minutos"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio del servicio"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
              disabled // La categoría no se debería poder editar desde este modal
            >
              <SelectTrigger id="category-trigger">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cabello">Cabello</SelectItem>
                <SelectItem value="barba">Barba</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditModalService
