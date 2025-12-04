'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useQuery } from '@tanstack/react-query'
import { getUserLocationEvents } from '@/modules/user-location/application/user-location-action'
import { getListUsers } from '@/modules/user/infra/actions/user.action'
import { useAssignUserToLocationMutation } from '@/modules/user-location/infra/hooks/useAssignUserToLocationMutation'
import { useDeactivateUserFromLocationMutation } from '@/modules/user-location/infra/hooks/useDeactivateUserFromLocationMutation'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { format, addDays, startOfWeek } from 'date-fns'

interface AssignUsersToLocationModalProps {
  isOpen: boolean
  onClose: () => void
  locationId: string
  locationName?: string
}

interface User {
  id: number
  userName: string
  email: string
}

export function AssignUsersToLocationModal ({
  isOpen,
  onClose,
  locationId,
  locationName = 'esta sede'
}: AssignUsersToLocationModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const [pendingChanges, setPendingChanges] = useState<Map<number, boolean>>(new Map())

  // Calcular fechas para obtener usuarios asignados
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const startDate = format(start, 'yyyy-MM-dd')
  const endDate = format(addDays(start, 6), 'yyyy-MM-dd')

  // Obtener todos los usuarios
  const { data: allUsers = { data: [] } } = useQuery({
    queryKey: ['all-users-for-assignment'],
    queryFn: () => getListUsers({ pageIndex: 1, pageSize: 1000 }),
    enabled: isOpen
  })

  // Obtener usuarios ya asignados a la sede
  const { data: assignedUserEvents = [] } = useQuery({
    queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, locationId, startDate, endDate],
    queryFn: () => getUserLocationEvents({ sedeId: locationId, startDate, endDate }),
    enabled: isOpen
  })

  // Hooks de mutación
  const assignMutation = useAssignUserToLocationMutation(locationId)
  const deactivateMutation = useDeactivateUserFromLocationMutation(locationId)

  // Procesar usuarios asignados (únicos) - memoizado para evitar recreación en cada render
  const assignedUserIds = useMemo(() => {
    return new Set(assignedUserEvents.map(event => event.user_id))
  }, [assignedUserEvents])

  // Inicializar estado cuando se abra el modal
  useEffect(() => {
    if (isOpen && assignedUserEvents.length >= 0) {
      const ids = new Set(assignedUserEvents.map(event => event.user_id))
      setSelectedUsers(ids)
      setPendingChanges(new Map())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, locationId])

  const handleUserToggle = (userId: number, isChecked: boolean) => {
    const newSelected = new Set(selectedUsers)
    const newPendingChanges = new Map(pendingChanges)

    if (isChecked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }

    // Marcar como cambio pendiente si es diferente del estado original
    const wasOrigininallyAssigned = assignedUserIds.has(userId)
    if (isChecked !== wasOrigininallyAssigned) {
      newPendingChanges.set(userId, isChecked)
    } else {
      newPendingChanges.delete(userId)
    }

    setSelectedUsers(newSelected)
    setPendingChanges(newPendingChanges)
  }

  const handleSave = async () => {
    const promises = Array.from(pendingChanges.entries()).map(([userId, shouldAssign]) => {
      if (shouldAssign) {
        // Asignar usuario
        return assignMutation.mutateAsync({
          sedeId: parseInt(locationId),
          userId
        })
      } else {
        // Desactivar usuario
        return deactivateMutation.mutateAsync({
          sedeId: parseInt(locationId),
          userId
        })
      }
    })

    try {
      await Promise.all(promises)
      onClose()
    } catch (error) {
      console.error('Error al guardar cambios:', error)
    }
  }

  const hasPendingChanges = pendingChanges.size > 0
  const isAnyMutationPending = assignMutation.isPending || deactivateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Plantilla de sede
          </DialogTitle>
          <DialogDescription>
            Asigna con qué miembros del equipo pueden reservar los clientes en {locationName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
              <Checkbox
                checked={false}
                disabled
              />
              <span className="text-sm font-medium text-blue-700">
                Todos los miembros del equipo
              </span>
              <span className="text-xs text-blue-600">
                {allUsers.data.length}
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {allUsers.data.map((user: User) => {
              const isChecked = selectedUsers.has(user.id)
              const hasPendingChange = pendingChanges.has(user.id)

              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    hasPendingChange
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleUserToggle(user.id, checked as boolean)
                    }
                    disabled={isAnyMutationPending}
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-sm">
                      {user.userName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-medium">{user.userName}</span>
                      {hasPendingChange && (
                        <span className="ml-2 text-xs text-yellow-600 font-medium">
                          {pendingChanges.get(user.id) ? '(Asignar)' : '(Quitar)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAnyMutationPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasPendingChanges || isAnyMutationPending}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            {isAnyMutationPending ? 'Aplicando...' : 'Aplicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
