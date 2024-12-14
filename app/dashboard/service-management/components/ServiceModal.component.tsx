'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Servicio } from '@/app/dashboard/service-management/mock/servicio.mock'

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Servicio) => void;
  serviceData?: Servicio | null; // Datos del servicio en caso de editar o null si es nuevo
}

export default function ServiceModal ({ isOpen, onClose, onSubmit, serviceData }: ServiceModalProps) {
  const [formData, setFormData] = useState<Servicio>({
    categoria: '',
    servicio: '',
    duracion: '',
    precio: '',
    fechaRegistro: ''
  })

  useEffect(() => {
    if (serviceData) {
      setFormData(serviceData)
    } else {
      setFormData({
        categoria: '',
        servicio: '',
        duracion: '',
        precio: '',
        fechaRegistro: ''
      })
    }
  }, [serviceData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{serviceData ? 'Editar Servicio' : 'Añadir Servicio'}</DialogTitle>
          <DialogDescription>
            {serviceData
              ? 'Actualice la información del servicio.'
              : 'Complete los campos para añadir un nuevo servicio.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="categoria"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            name="servicio"
            placeholder="Servicio"
            value={formData.servicio}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            name="duracion"
            placeholder="Duración"
            value={formData.duracion}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {serviceData ? 'Actualizar' : 'Añadir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
