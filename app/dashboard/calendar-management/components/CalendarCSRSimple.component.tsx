'use client'

import { useState } from 'react'
import { useGoogleTokens } from '@/hooks/use-google-tokens'
import { useLocations } from '../../hook/client/useCalendarQueries'
import { LocationResponseModel } from '@/modules/location/domain/models/location.model'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Calendar, MapPin, RefreshCw } from 'lucide-react'

export function CalendarCSRComponent () {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('0')
  const { hasTokens, accessToken } = useGoogleTokens()
  const locationsQuery = useLocations()

  if (!hasTokens) {
    return (
      <Card className="w-full border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            Tokens de Google Requeridos
          </CardTitle>
          <CardDescription className="text-orange-700">
            Para usar el calendario CSR, necesitas tener tokens de Google válidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 text-sm">
            Ve a la pestaña Configuración de Tokens para configurar tus credenciales de Google.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estado de los tokens */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calendar className="h-5 w-5" />
            Estado de Conexión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-700">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
              ✅ Conectado
            </span>
            <span className="text-sm">
              Token válido: {accessToken ? `${accessToken.substring(0, 20)}...` : 'No disponible'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Selector de ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar Ubicación
          </CardTitle>
          <CardDescription>
            Selecciona una ubicación para ver los datos del calendario usando CSR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Selecciona una ubicación...</SelectItem>
              {locationsQuery.data?.data?.map((location: LocationResponseModel) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.nombre_sede || 'Sin nombre'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {locationsQuery.isLoading && (
            <p className="text-sm text-gray-500 mt-2">Cargando ubicaciones...</p>
          )}

          {locationsQuery.error && (
            <div className="flex items-center gap-2 text-red-600 mt-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error al cargar ubicaciones</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de la ubicación seleccionada */}
      {selectedLocationId !== '0' && locationsQuery.data?.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedLocation = locationsQuery.data.data.find(
                (location: LocationResponseModel) => location.id.toString() === selectedLocationId
              )
              return selectedLocation
                ? (
                    <div className="space-y-2">
                      <p><strong>Nombre:</strong> {selectedLocation.nombre_sede || 'Sin nombre'}</p>
                      <p><strong>Dirección:</strong> {selectedLocation.direccion_sede || 'Sin dirección'}</p>
                      <p><strong>Teléfono:</strong> {selectedLocation.telefono_sede || 'Sin teléfono'}</p>
                      <p><strong>Estado:</strong> {selectedLocation.status ? '✅ Activa' : '❌ Inactiva'}</p>
                    </div>
                  )
                : (
                    <p>Ubicación no encontrada</p>
                  )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Botón de refrescar ubicaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Datos de Ubicaciones por CSR</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                locationsQuery.refetch()
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Refrescar
            </Button>
          </CardTitle>
          <CardDescription>
            Datos obtenidos usando TanStack Query + axiosClientApi + tokens de Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Estado de la query de ubicaciones:</strong>
            </p>
            <ul className="text-xs space-y-1">
              <li>Ubicaciones: {locationsQuery.isLoading ? '⏳ Cargando' : locationsQuery.error ? '❌ Error' : '✅ Listo'}</li>
              <li>Total de ubicaciones: {locationsQuery.data?.data?.length || 0}</li>
              <li>Página actual: {locationsQuery.data?.meta?.page || 'N/A'}</li>
              <li>Total de registros: {locationsQuery.data?.meta?.total || 'N/A'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Estado de error general */}
      {locationsQuery.error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Error al Cargar Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm">
              Hubo un problema al cargar las ubicaciones. Verifica tu conexión y tokens.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => locationsQuery.refetch()}
              className="mt-2"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
