'use client'
import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Cell from '@/app/dashboard/user-management/components/CellShiftManagement.component'
import CellShiftActions from '@/app/dashboard/user-management/components/CellShiftActions.component'
import { useQuery } from '@tanstack/react-query'
import { getUserLocationEvents } from '@/modules/user-location/application/user-location-action'
import { getLocationById } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_USER_LOCATION_MANAGEMENT, QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { UserLocationEvent } from '@/modules/user-location/domain/repositories/user-location.repository'
import { IconComponent } from '@/app/components/Icon.component'
import { AssignUsersToLocationModal } from './AssignUsersToLocationModal.component'

interface TableShiftManagementProps {
  selectedDate: number
  locationFilter: string
}

interface ShiftEvent {
  event_id: number
  event_type: string
  start_time: string
  end_time: string
  display_time: string
  original_event: UserLocationEvent
}

interface ProcessedEmployee {
  user_id: number
  name: string
  email: string
  dailyShifts: Record<string, ShiftEvent[]>
}

const TableShiftManagement = ({ selectedDate, locationFilter }: TableShiftManagementProps) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const start = startOfWeek(new Date(selectedDate), { weekStartsOn: 1 })
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const formattedDates = daysOfWeek.map(date => format(date, 'yyyy-MM-dd'))

  // Obtener eventos de usuarios por sede
  const { data: userEvents = [] } = useQuery({
    queryKey: [QUERY_KEYS_USER_LOCATION_MANAGEMENT.ULMGetUserLocationEvents, locationFilter, formattedDates[0], formattedDates[6]],
    queryFn: async () => {
      const result = await getUserLocationEvents({
        sedeId: locationFilter,
        startDate: formattedDates[0],
        endDate: formattedDates[6]
      })
      return result
    }
  })

  // Obtener información de la sede (horarios)
  const { data: location } = useQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, locationFilter],
    queryFn: () => getLocationById(locationFilter)
  })

  // Función para obtener el horario de la sede por día de la semana
  const getLocationScheduleForDay = (date: string): string => {
    if (!location?.openingHours) return 'Sin turno'

    const dayOfWeek = new Date(date + 'T12:00:00').getDay()

    const dayMapping: Record<number, string> = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miercoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sabado'
    }

    const mappedDay = dayMapping[dayOfWeek]
    const schedule = location.openingHours.find(s => s.day === mappedDay)

    if (!schedule) {
      return 'Sin turno'
    }

    if (schedule.ranges.length === 0) {
      return 'Sin turno'
    }

    return schedule.ranges.map(range => `${range.start} - ${range.end}`).join(', ')
  }

  // Procesar datos de usuarios y sus eventos
  const processedEmployees = userEvents.reduce((acc: ProcessedEmployee[], event: UserLocationEvent) => {
    let employee = acc.find(emp => emp.user_id === event.user_id)

    if (!employee) {
      employee = {
        user_id: event.user_id,
        name: event.user_name,
        email: event.email,
        dailyShifts: {}
      }
      acc.push(employee)
    }

    const eventDate = format(new Date(event.event_start_time), 'yyyy-MM-dd')

    if (!employee.dailyShifts[eventDate]) {
      employee.dailyShifts[eventDate] = []
    }

    if (event.event_type === 'turno' || event.event_type === 'SHIFT') {
      const shiftEvent: ShiftEvent = {
        event_id: event.event_id,
        event_type: event.event_type,
        start_time: format(new Date(event.event_start_time), 'HH:mm'),
        end_time: format(new Date(event.event_end_time), 'HH:mm'),
        display_time: `${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`,
        original_event: event
      }
      employee.dailyShifts[eventDate].push(shiftEvent)
    } else if (event.event_type === 'DAY_OFF' || event.event_type === 'dia_libre' || event.event_type === 'day_off' || event.event_type === 'days_off') {
      const dayOffEvent: ShiftEvent = {
        event_id: event.event_id,
        event_type: event.event_type,
        start_time: format(new Date(event.event_start_time), 'HH:mm'),
        end_time: format(new Date(event.event_end_time), 'HH:mm'),
        display_time: `No disponible\n${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`,
        original_event: event
      }
      employee.dailyShifts[eventDate].push(dayOffEvent)
    } else {
      const otherEvent: ShiftEvent = {
        event_id: event.event_id,
        event_type: event.event_type,
        start_time: format(new Date(event.event_start_time), 'HH:mm'),
        end_time: format(new Date(event.event_end_time), 'HH:mm'),
        display_time: `No disponible\n${format(new Date(event.event_start_time), 'HH:mm')} - ${format(new Date(event.event_end_time), 'HH:mm')}`,
        original_event: event
      }
      employee.dailyShifts[eventDate].push(otherEvent)
    }

    return acc
  }, [])

  // Función para obtener qué mostrar cuando no hay eventos
  const getDefaultCellContent = (date: string): ShiftEvent => {
    return {
      event_id: 0,
      event_type: 'default',
      start_time: '',
      end_time: '',
      display_time: getLocationScheduleForDay(date),
      original_event: {} as UserLocationEvent
    }
  }

  // Función para obtener los eventos de día libre para una fecha y usuario
  const getDayOffEvent = (userId: number, date: string): UserLocationEvent | undefined => {
    return userEvents.find(event => {
      const eventDate = format(new Date(event.event_start_time), 'yyyy-MM-dd')
      return (
        event.user_id === userId &&
        eventDate === date &&
        (event.event_type === 'DAY_OFF' || event.event_type === 'dia_libre' || event.event_type === 'day_off' || event.event_type === 'days_off')
      )
    })
  }

  // Si no hay empleados asignados a la sede
  if (processedEmployees.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Esta sede no cuenta con barberos asignados
          </h3>
          <p className="text-gray-500">
            No hay empleados disponibles para mostrar horarios en esta ubicación.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left">
              <div className="flex items-center gap-2">
                <span>Miembro del equipo</span>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Gestionar asignaciones de sede"
                >
                  <IconComponent name="pencil" className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                </button>
              </div>
            </th>
            {daysOfWeek.map((date, i) => (
              <th key={i} className="p-3">
                {format(date, 'EEE, d MMM', { locale: es })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedEmployees.map((employee) => (
            <tr key={employee.user_id} className="border-t border-gray-300">
              <td className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
                  {employee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <span>{employee.name}</span>
              </td>
              {formattedDates.map((date, i) => {
                const dailyShifts = employee.dailyShifts[date] || []

                if (dailyShifts.length === 0) {
                  const defaultShift = getDefaultCellContent(date)
                  const dayOffEvent = getDayOffEvent(employee.user_id, date)

                  return (
                    <td key={i} className="p-2">
                      <div className="space-y-1">
                        <Cell
                          shift={defaultShift.display_time}
                          id={`${employee.user_id}-${i}-default`}
                          openId={openId}
                          setOpenId={setOpenId}
                          employeeName={employee.name}
                          selectedDate={date}
                          userId={employee.user_id}
                          dayOffEvent={dayOffEvent}
                          shiftId={undefined}
                          shiftDateISO={date}
                        />
                        <div className="flex justify-center">
                          <CellShiftActions
                            shift={defaultShift.display_time}
                            employeeName={employee.name}
                            selectedDate={date}
                            userId={employee.user_id}
                            dayOffEvent={dayOffEvent}
                          />
                        </div>
                      </div>
                    </td>
                  )
                }

                return (
                  <td key={i} className="p-2">
                    <div className="space-y-2">
                      {dailyShifts.map((shift, shiftIndex) => {
                        const dayOffEvent = shift.event_type.includes('DAY_OFF') ||
                                          shift.event_type.includes('dia_libre') ||
                                          shift.event_type.includes('day_off') ||
                                          shift.event_type.includes('days_off')
                          ? shift.original_event
                          : undefined

                        const shiftId = (shift.event_type === 'turno' || shift.event_type === 'SHIFT')
                          ? shift.event_id
                          : undefined

                        return (
                          <div key={`${shift.event_id}-${shiftIndex}`} className="mb-1">
                            <Cell
                              shift={shift.display_time}
                              id={`${employee.user_id}-${i}-${shift.event_id}`}
                              openId={openId}
                              setOpenId={setOpenId}
                              employeeName={employee.name}
                              selectedDate={date}
                              userId={employee.user_id}
                              dayOffEvent={dayOffEvent}
                              shiftId={shiftId}
                              shiftDateISO={date}
                            />
                            <div className="flex justify-center mt-1">
                              <CellShiftActions
                                shift={shift.display_time}
                                employeeName={employee.name}
                                selectedDate={date}
                                userId={employee.user_id}
                                dayOffEvent={dayOffEvent}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <AssignUsersToLocationModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        locationId={locationFilter}
        locationName={location?.name}
      />
    </div>
  )
}

export default TableShiftManagement
