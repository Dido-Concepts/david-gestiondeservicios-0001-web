// @/components/ui/filters-panel.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FiltersPanelProps {
  onClose: () => void
  onApply: () => void
  onClearAll: () => void
}

export function FiltersPanel ({ onClose, onApply, onClearAll }: FiltersPanelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filtros</h2>
        <Button variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Secciones de filtros */}
      <div className="space-y-4">
        {/* Barbero */}
        <div>
          <Label htmlFor="miembro">Barbero</Label>
          <Select>
            <SelectTrigger id="miembro">
              <SelectValue placeholder="Todos los barberos del equipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los barberos</SelectItem>
              <SelectItem value="miembro1">Barbero 1</SelectItem>
              <SelectItem value="miembro2">Barbero 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cliente */}
        <div>
          <Label htmlFor="categoria">Cliente</Label>
          <Select>
            <SelectTrigger id="categoria">
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              <SelectItem value="categoria1">Cliente 1</SelectItem>
              <SelectItem value="categoria2">Cliente 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <Button variant="link" className="text-purple-600" onClick={onClearAll}>
          Borrar todos los filtros
        </Button>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onApply}>
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  )
}
