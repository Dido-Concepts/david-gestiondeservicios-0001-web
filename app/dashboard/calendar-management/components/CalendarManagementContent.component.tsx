'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { useLocations } from '../../hook/client/useCalendarQueries'
import { LocationResponseModel } from '@/modules/location/domain/models/location.model'
import { BasicCalendar } from './BasicCalendar.component'

export function CalendarManagementContent () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Obtener idLocation de los parámetros de la URL
  const idLocationFromUrl = searchParams.get('idLocation') || ''

  const [selectedLocation, setSelectedLocation] = useState<string>(idLocationFromUrl)
  const locationsQuery = useLocations()

  // Sincronizar el estado local con la URL cuando cambie
  useEffect(() => {
    setSelectedLocation(idLocationFromUrl)
  }, [idLocationFromUrl])

  // Función para actualizar la URL cuando cambie la selección
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId)

    // Crear nuevos parámetros de búsqueda
    const params = new URLSearchParams(searchParams.toString())

    if (locationId) {
      params.set('idLocation', locationId)
    } else {
      params.delete('idLocation')
    }

    // Actualizar la URL sin recargar la página
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <main className="container mx-auto px-3 py-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8">Gestión de Calendario</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location-select" className="text-sm sm:text-base">Ubicación</Label>
          <Select
            value={selectedLocation}
            onValueChange={handleLocationChange}
          >
            <SelectTrigger id="location-select" className="w-full sm:max-w-sm text-sm sm:text-base">
              <SelectValue placeholder="Selecciona una ubicación" />
            </SelectTrigger>
            <SelectContent>
              {locationsQuery.isLoading && (
                <SelectItem value="loading" disabled>
                  Cargando ubicaciones...
                </SelectItem>
              )}
              {locationsQuery.error && (
                <SelectItem value="error" disabled>
                  Error al cargar ubicaciones
                </SelectItem>
              )}
              {locationsQuery.data?.data?.map((location: LocationResponseModel) => (
                <SelectItem
                  key={location.id}
                  value={location.id.toString()}
                >
                  {location.nombre_sede || `Ubicación ${location.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Card informativo - Solo mostrar si no hay ubicación seleccionada */}
        {!selectedLocation && (
          <Card className="w-full bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-yellow-800 text-sm sm:text-base">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                Selecciona una ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="space-y-2 text-xs sm:text-sm text-yellow-700">
                <p>
                  Para ver el calendario de citas, primero debes seleccionar una ubicación desde el selector de arriba.
                </p>
                <p>
                  Una vez seleccionada la ubicación, podrás gestionar las citas y eventos del calendario.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendario cuando hay ubicación seleccionada */}
        {selectedLocation && (
          <BasicCalendar />
        )}
      </div>
    </main>
  )
}
