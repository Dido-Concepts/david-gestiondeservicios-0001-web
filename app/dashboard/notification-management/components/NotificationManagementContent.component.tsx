'use client'

import { useState, useEffect } from 'react'
import { IconComponent } from '@/app/components/Icon.component'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useNotificationStatus, useToggleNotificationStatus } from '@/app/dashboard/hook/client/useNotificationQueries'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export function NotificationManagementContent () {
  const [isMounted, setIsMounted] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { data: notificationStatus, isLoading, error } = useNotificationStatus()
  const toggleNotification = useToggleNotificationStatus()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleToggleStatus = async () => {
    if (!notificationStatus) return

    setIsToggling(true)
    try {
      const result = await toggleNotification.mutateAsync(!notificationStatus.is_active)

      toast({
        title: 'Notificación actualizada',
        description: result.message,
        variant: 'default'
      })
    } catch (error) {
      console.error('Error al cambiar estado de notificación:', error)

      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la notificación',
        variant: 'destructive'
      })
    } finally {
      setIsToggling(false)
    }
  }

  // Evitar hydration mismatch
  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return (
      <main className="container mx-auto p-0 space-y-6">
        <div className="w-full">
          <div className="py-10 text-2xl font-bold px-5">Recordatorios</div>
        </div>
        <div className="w-full px-5">
          <Card className="max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <span className="text-orange-500 text-2xl">🔔</span>
              <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-20"></div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto p-0 space-y-6">
        <div className="w-full">
          <div className="py-10 text-2xl font-bold px-5">Recordatorios</div>
        </div>
        <div className="w-full px-5">
          <Card className="max-w-md border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">Error al cargar el estado de las notificaciones</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const isActive = Boolean(notificationStatus?.is_active)
  const actionText = isActive ? 'Desactivar' : 'Activar'
  const statusText = isActive ? 'Activo' : 'Inactivo'
  const statusClass = isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'

  return (
    <main className="container mx-auto p-0 space-y-6">
      <div className="w-full">
        <div className="py-10 text-2xl font-bold px-5">Recordatorios</div>
      </div>

      <div className="w-full px-5 space-y-4">
        <Card className="max-w-md border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <span className="text-orange-500 text-2xl">🔔</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-600 hover:text-gray-800"
                  disabled={isToggling}
                >
                  <IconComponent name="ellipsis" width={20} height={20} className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/dashboard/notification-management/notification-for-24hour">
                  <DropdownMenuItem className="cursor-pointer">
                    <IconComponent name="pencil" width={16} height={16} className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                >
                  <IconComponent
                    name={isActive ? 'lock' : 'unlock'}
                    width={16}
                    height={16}
                    className="w-4 h-4 mr-2"
                  />
                  {actionText}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">
              Recordatorio de próxima cita 24 horas antes
            </h3>
            <p className="text-gray-500 text-sm">
              Envía una notificación a los clientes para recordarles cuándo es su próxima cita.
            </p>
            {notificationStatus?.workflow_name && (
              <p className="text-xs text-gray-400">
                Workflow: {notificationStatus.workflow_name}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-3 py-1 rounded-full ${statusClass}`}>
                {statusText}
              </span>
              {isToggling && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <IconComponent name="spinner" width={12} height={12} className="w-3 h-3 animate-spin" />
                  Actualizando...
                </span>
              )}
            </div>
            {notificationStatus?.last_updated && (
              <p className="text-xs text-gray-400">
                Última actualización: {new Date(notificationStatus.last_updated).toLocaleString('es-ES')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
