'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import WeekSelector from '@/app/dashboard/user-management/components/WeekSelector.component'
import TableShiftManagement from '@/app/dashboard/user-management/components/TableShiftManagement.component'
import { AssignUsersToLocationModal } from '@/app/dashboard/user-management/components/AssignUsersToLocationModal.component'
import { IconComponent } from '@/app/components/Icon.component'
import { getLocationById } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'

const ShiftManagementContainer = () => {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getTime())
  const [openId, setOpenId] = useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const locationFilter = searchParams.get('locationFilter') || '1'

  // Obtener información de la sede
  const { data: location } = useQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, locationFilter],
    queryFn: () => getLocationById(locationFilter)
  })

  return (
    <>
      {/* Header con botón de asignar barberos */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-app-primary text-white rounded-lg hover:bg-app-primary/90 transition-colors font-medium"
          title="Gestionar asignaciones de sede"
        >
          <IconComponent name="group" className="w-5 h-5" />
          <span>Asignar barberos</span>
        </button>
      </div>

      {/* Componente para seleccionar la semana */}
      <div className="flex justify-center my-4">
        <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      {/* Tabla de turnos basada en la semana seleccionada */}
      <TableShiftManagement
        selectedDate={selectedDate}
        locationFilter={locationFilter}
        openId={openId}
        setOpenId={setOpenId}
      />

      <AssignUsersToLocationModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        locationId={locationFilter}
        locationName={location?.name}
      />
    </>
  )
}

export default ShiftManagementContainer
//
