// @/components/ui/filters-panel.tsx
'use client'

import React, { useState } from 'react'
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
import { useStaff } from '@/app/dashboard/hook/client/useStaffQueries'
import { useLocations } from '@/app/dashboard/hook/client/useCalendarQueries'
import { useStatus } from '@/app/dashboard/hook/client/useStatusQueries'

interface FilterState {
  barbero_id?: number
  sede_id?: number
  status_id?: number
}

interface FiltersPanelProps {
  onClose: () => void
  onApply: (filters: FilterState) => void
  onClearAll: () => void
}

export function FiltersPanel ({ onClose, onApply, onClearAll }: FiltersPanelProps) {
  // Estado para manejar los filtros seleccionados
  const [filters, setFilters] = useState<FilterState>({
    barbero_id: undefined,
    sede_id: undefined,
    status_id: undefined
  })

  // Consulta para obtener los barberos usando el hook
  const {
    data: staffData,
    isLoading: isLoadingStaff,
    error: staffError
  } = useStaff({
    location_id: filters.sede_id?.toString() || '0', // Usar la sede seleccionada o '0' para mostrar todos
    role_id: 9, // role_id para barberos
    pageIndex: 1,
    pageSize: 100,
    enabled: true // Siempre habilitado
  })

  // Consulta para obtener las ubicaciones/sedes usando el hook
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error: locationsError
  } = useLocations({
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'id',
    sortBy: 'ASC',
    filters: { status: true } // Solo sedes activas
  })

  // Consulta para obtener los estados de citas
  const {
    data: statusData,
    isLoading: isLoadingStatus,
    error: statusError
  } = useStatus({
    table_name: 'StatusCitaCalendario',
    pageIndex: 1,
    pageSize: 100,
    orderBy: 'item_order',
    sortBy: 'ASC',
    enabled: true
  })

  const barberos = staffData?.data || []
  const sedes = locationsData?.data || []
  const estados = statusData?.data || []

  // Función para limpiar todos los filtros
  const handleClearAll = () => {
    setFilters({
      barbero_id: undefined,
      sede_id: undefined,
      status_id: undefined
    })
    onClearAll()
  }

  // Función para aplicar los filtros
  const handleApply = () => {
    onApply(filters)
  }

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
        {/* Sede */}
        <div>
          <Label htmlFor="sede">Sede</Label>
          <Select
            value={filters.sede_id?.toString() || ''}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                sede_id: value === 'all' ? undefined : parseInt(value)
              }))
            }
          >
            <SelectTrigger id="sede">
              <SelectValue placeholder="Todas las sedes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sedes</SelectItem>
              {isLoadingLocations && (
                <SelectItem value="loading" disabled>
                  Cargando sedes...
                </SelectItem>
              )}
              {locationsError && (
                <SelectItem value="error" disabled>
                  Error al cargar sedes
                </SelectItem>
              )}
              {sedes.map((sede) => (
                <SelectItem key={sede.id} value={sede.id.toString()}>
                  {sede.nombre_sede}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Barbero */}
        <div>
          <Label htmlFor="barbero">Barbero</Label>
          <Select
            value={filters.barbero_id?.toString() || ''}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                barbero_id: value === 'all' ? undefined : parseInt(value)
              }))
            }
          >
            <SelectTrigger id="barbero">
              <SelectValue placeholder='Todos los barberos del equipo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los barberos</SelectItem>
              {isLoadingStaff && (
                <SelectItem value="loading" disabled>
                  Cargando barberos...
                </SelectItem>
              )}
              {staffError && (
                <SelectItem value="error" disabled>
                  Error al cargar barberos
                </SelectItem>
              )}
              {barberos.map((barbero) => (
                <SelectItem key={barbero.id} value={barbero.id.toString()}>
                  {barbero.user_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado de cita */}
        <div>
          <Label htmlFor="status">Estado de cita</Label>
          <Select
            value={filters.status_id?.toString() || ''}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                status_id: value === 'all' ? undefined : parseInt(value)
              }))
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder='Todos los estados' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {isLoadingStatus && (
                <SelectItem value="loading" disabled>
                  Cargando estados...
                </SelectItem>
              )}
              {statusError && (
                <SelectItem value="error" disabled>
                  Error al cargar estados
                </SelectItem>
              )}
              {estados.map((estado) => (
                <SelectItem key={estado.maintable_id} value={estado.maintable_id.toString()}>
                  {estado.item_text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <Button variant="link" className="text-purple-600" onClick={handleClearAll}>
          Borrar todos los filtros
        </Button>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  )
}
