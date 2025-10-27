'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { useNotificationLocations, useToggleNotificationLocation } from '@/app/dashboard/hook/client/useNotificationQueries'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function NotificationLocationsContent () {
  const [isMounted, setIsMounted] = useState(false)
  const { data: locations, isLoading, error } = useNotificationLocations()
  const toggleLocationMutation = useToggleNotificationLocation()
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({})

  // Evitar problemas de hidratación
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleToggleLocation = async (locationId: number, currentState: boolean) => {
    const newState = !currentState

    // Establecer estado de loading para esta ubicación específica
    setLoadingStates(prev => ({ ...prev, [locationId]: true }))

    // Mostrar toast de loading
    toast({
      title: 'Actualizando notificación',
      description: `${newState ? 'Activando' : 'Desactivando'} notificaciones para esta ubicación...`
    })

    try {
      await toggleLocationMutation.mutateAsync({
        locationId,
        isActive: newState
      })

      // Toast de éxito
      toast({
        title: 'Notificación actualizada',
        description: `Las notificaciones han sido ${newState ? 'activadas' : 'desactivadas'} correctamente.`
      })
    } catch (error) {
      // Toast de error
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el estado de la notificación. Inténtalo de nuevo.'
      })
      console.error('Error al toggle notification:', error)
    } finally {
      // Quitar estado de loading
      setLoadingStates(prev => ({ ...prev, [locationId]: false }))
    }
  }

  // Mostrar loading hasta que el componente esté montado
  if (!isMounted || isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/notification-management">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Notificaciones por Ubicación</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las notificaciones para cada ubicación. Activa o desactiva las notificaciones según sea necesario.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-11" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/notification-management">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center text-center pt-6">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <CardTitle className="mb-2">Error al cargar ubicaciones</CardTitle>
              <CardDescription>
                No se pudieron cargar las ubicaciones. Por favor, verifica tu conexión e inténtalo de nuevo.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/notification-management">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Notificaciones por Ubicación</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona las notificaciones para cada ubicación. Activa o desactiva las notificaciones según sea necesario.
        </p>
      </div>

      {locations && locations.length === 0
        ? (
          <Card>
            <CardContent className="flex flex-col items-center text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No hay ubicaciones disponibles</CardTitle>
              <CardDescription>
                No se encontraron ubicaciones para configurar notificaciones.
              </CardDescription>
            </CardContent>
          </Card>
          )
        : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locations?.map((location) => (
              <Card key={location.location_id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{location.location_name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">ID: {location.location_id}</span>
                      </div>
                    </div>
                    <Badge
                      variant={location.is_notification_active ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {location.is_notification_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Estado de notificaciones</p>
                      <p className="text-xs text-muted-foreground">
                        {location.notification_location_id
                          ? `Configuración ID: ${location.notification_location_id}`
                          : 'Sin configuración'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={location.is_notification_active}
                      onCheckedChange={() => handleToggleLocation(location.location_id, location.is_notification_active)}
                      disabled={loadingStates[location.location_id] || toggleLocationMutation.isPending}
                      className="shrink-0"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

      {locations && locations.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Total de ubicaciones:</strong> {locations.length} |
            <strong> Activas:</strong> {locations.filter(l => l.is_notification_active).length} |
            <strong> Inactivas:</strong> {locations.filter(l => !l.is_notification_active).length}
          </p>
        </div>
      )}
    </div>
  )
}
