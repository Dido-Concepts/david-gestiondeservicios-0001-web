// ============================
// TIPOS DE DATOS
// ============================
import { getCustomersV2 } from '@/modules/customer/application/actions/customer.action'
import { getServicesV2 } from '@/modules/service/application/actions/service.action'
import { getMaintableV2 } from '@/modules/maintable/application/actions/maintable.action'

export type CalendarEvent = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  locationId: string
  client?: string
  service?: string
  barber?: string
  status: string // Valores de la BD: '1' = Reservada, '2' = Confirmada, '3' = Finalizado, '4' = Cancelar
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
}

export type Service = {
  id: string
  name: string
  duration: number // en minutos
  price: number
  category: string
}

export type Barber = {
  id: string
  name: string
  specialties: string[]
  locationIds: string[]
}

export type StatusOption = {
  id: string
  label: string
  value: string
}

// ============================
// HELPER PARA GENERAR FECHAS EN HORA DE PERÚ
// ============================
const generateDateString = (daysFromToday: number, hour: number, minute: number = 0): string => {
  // Crear fecha en zona horaria de Perú
  const now = new Date()
  const peruDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }))

  peruDate.setDate(peruDate.getDate() + daysFromToday)
  peruDate.setHours(hour, minute, 0, 0)

  return peruDate.toISOString()
}

// ============================
// DATOS MOCK
// ============================
const mockUsers: User[] = [
  { id: '22', name: 'Esteban Villantoy', email: 'villantoyesteban@gmail.com' },
  { id: '23', name: 'Jeffri Cervantes', email: 'jeffcervantes99@gmail.com' }
]

const mockServices: Service[] = [
  { id: '1', name: 'Corte Premium', duration: 45, price: 25, category: 'Corte' },
  { id: '2', name: 'Corte Básico', duration: 30, price: 15, category: 'Corte' },
  { id: '3', name: 'Corte Niños', duration: 25, price: 12, category: 'Corte' },
  { id: '4', name: 'Barba', duration: 20, price: 10, category: 'Barba' },
  { id: '5', name: 'Cejas', duration: 15, price: 8, category: 'Cejas' },
  { id: '6', name: 'Tratamiento Capilar', duration: 60, price: 35, category: 'Tratamiento' },
  { id: '7', name: 'Lavado', duration: 15, price: 5, category: 'Lavado' },
  { id: '8', name: 'Peinado', duration: 30, price: 20, category: 'Peinado' },
  { id: '9', name: 'Maquillaje', duration: 45, price: 30, category: 'Maquillaje' },
  { id: '10', name: 'Coloración', duration: 120, price: 50, category: 'Color' },
  { id: '11', name: 'Mechas', duration: 150, price: 60, category: 'Color' },
  { id: '12', name: 'Alisado', duration: 180, price: 80, category: 'Tratamiento' },
  { id: '13', name: 'Extensiones', duration: 120, price: 100, category: 'Extensiones' },
  { id: '14', name: 'Manicure', duration: 45, price: 15, category: 'Uñas' },
  { id: '15', name: 'Pedicure', duration: 60, price: 20, category: 'Uñas' }
]

const mockBarbers: Barber[] = [
  { id: '22', name: 'Esteban Villantoy', specialties: ['Corte', 'Barba', 'Tratamiento'], locationIds: ['11', '12', '6', '4'] },
  { id: '23', name: 'Jeffri Cervantes', specialties: ['Corte Premium', 'Peinado', 'Color'], locationIds: ['11', '12', '6', '4'] }
]

// ============================
// ALMACENAMIENTO EN MEMORIA PARA EL MOCK
// ============================
class MockEventStore {
  private events: Map<string, CalendarEvent[]> = new Map()
  private eventCounter = 1000

  // Inicializar eventos base por ubicación
  private initializeBaseEvents () {
    // Ubicación 4 (nueva)
    this.events.set('4', [
      {
        id: 'loc4-1',
        title: 'Corte Premium',
        start: generateDateString(0, 8, 0),
        end: generateDateString(0, 8, 45),
        locationId: '4',
        client: 'Esteban Villantoy',
        service: 'Corte Premium',
        barber: 'Esteban Villantoy',
        status: '2' // Confirmada
      },
      {
        id: 'loc4-2',
        title: 'Barba',
        start: generateDateString(1, 9, 30),
        end: generateDateString(1, 9, 50),
        locationId: '4',
        client: 'Jeffri Cervantes',
        service: 'Barba',
        barber: 'Jeffri Cervantes',
        status: '1' // Reservada
      }
    ])

    // Ubicación 11
    this.events.set('11', [
      {
        id: 'loc11-1',
        title: 'Corte Premium',
        start: generateDateString(0, 9, 0),
        end: generateDateString(0, 10, 30),
        locationId: '11',
        client: 'Esteban Villantoy',
        service: 'Corte Premium',
        barber: 'Jeffri Cervantes',
        status: '2' // Confirmada
      },
      {
        id: 'loc11-2',
        title: 'Tratamiento Capilar',
        start: generateDateString(0, 11, 0),
        end: generateDateString(0, 12, 0),
        locationId: '11',
        client: 'Jeffri Cervantes',
        service: 'Tratamiento Capilar',
        barber: 'Esteban Villantoy',
        status: '1' // Reservada
      },
      {
        id: 'loc11-3',
        title: 'Corte Niños',
        start: generateDateString(1, 10, 0),
        end: generateDateString(1, 10, 45),
        locationId: '11',
        client: 'Jeffri Cervantes',
        service: 'Corte Niños',
        barber: 'Esteban Villantoy',
        status: '2' // Confirmada
      },
      {
        id: 'loc11-4',
        title: 'Peinado',
        start: generateDateString(2, 15, 0),
        end: generateDateString(2, 16, 30),
        locationId: '11',
        client: 'Esteban Villantoy',
        service: 'Peinado',
        barber: 'Jeffri Cervantes',
        status: '1' // Reservada
      },
      {
        id: 'loc11-5',
        title: 'Tratamiento Capilar',
        start: generateDateString(3, 14, 0),
        end: generateDateString(3, 15, 0),
        locationId: '11',
        client: 'Jeffri Cervantes',
        service: 'Tratamiento Capilar',
        barber: 'Esteban Villantoy',
        status: '3' // Finalizado
      },
      {
        id: 'loc11-6',
        title: 'Corte Básico',
        start: generateDateString(-1, 9, 0),
        end: generateDateString(-1, 10, 0),
        locationId: '11',
        client: 'Esteban Villantoy',
        service: 'Corte Básico',
        barber: 'Esteban Villantoy',
        status: '4' // Cancelar
      }
    ])

    // Ubicación 12
    this.events.set('12', [
      {
        id: 'loc12-1',
        title: 'Coloración',
        start: generateDateString(0, 8, 30),
        end: generateDateString(0, 11, 30),
        locationId: '12',
        client: 'Esteban Villantoy',
        service: 'Coloración',
        barber: 'Jeffri Cervantes',
        status: '2' // Confirmada
      },
      {
        id: 'loc12-2',
        title: 'Alisado',
        start: generateDateString(0, 13, 0),
        end: generateDateString(0, 16, 0),
        locationId: '12',
        client: 'Jeffri Cervantes',
        service: 'Alisado',
        barber: 'Jeffri Cervantes',
        status: '1' // Reservada
      },
      {
        id: 'loc12-3',
        title: 'Corte Premium',
        start: generateDateString(1, 11, 30),
        end: generateDateString(1, 12, 15),
        locationId: '12',
        client: 'Esteban Villantoy',
        service: 'Corte Premium',
        barber: 'Esteban Villantoy',
        status: '2' // Confirmada
      }
    ])

    // Ubicación 6
    this.events.set('6', [
      {
        id: 'loc6-1',
        title: 'Corte Básico',
        start: generateDateString(0, 10, 0),
        end: generateDateString(0, 10, 30),
        locationId: '6',
        client: 'Esteban Villantoy',
        service: 'Corte Básico',
        barber: 'Esteban Villantoy',
        status: '2' // Confirmada
      },
      {
        id: 'loc6-2',
        title: 'Mechas',
        start: generateDateString(1, 14, 0),
        end: generateDateString(1, 16, 30),
        locationId: '6',
        client: 'Jeffri Cervantes',
        service: 'Mechas',
        barber: 'Jeffri Cervantes',
        status: '1' // Reservada
      },
      {
        id: 'loc6-3',
        title: 'Manicure',
        start: generateDateString(2, 16, 0),
        end: generateDateString(2, 16, 45),
        locationId: '6',
        client: 'Jeffri Cervantes',
        service: 'Manicure',
        barber: 'Esteban Villantoy',
        status: '2' // Confirmada
      }
    ])
  }

  constructor () {
    this.initializeBaseEvents()
  }

  getEvents (locationId: string): CalendarEvent[] {
    return this.events.get(locationId) || []
  }

  createEvent (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      id: `event-${this.eventCounter++}`,
      ...eventData
    }

    const locationEvents = this.events.get(eventData.locationId) || []
    locationEvents.push(newEvent)
    this.events.set(eventData.locationId, locationEvents)

    console.log('📅 Evento creado y guardado:', newEvent)
    return newEvent
  }

  updateEvent (id: string, eventData: Partial<CalendarEvent>): CalendarEvent | null {
    console.log('🔄 Actualizando evento:', { id, eventData })

    // Buscar el evento en todas las ubicaciones
    const locationIds = Array.from(this.events.keys())

    for (const locationId of locationIds) {
      const events = this.events.get(locationId) || []
      const eventIndex = events.findIndex((e: CalendarEvent) => e.id === id)

      if (eventIndex !== -1) {
        const existingEvent = events[eventIndex]
        const updatedEvent: CalendarEvent = {
          ...existingEvent,
          ...eventData,
          id // Mantener el ID original
        }

        // Si cambió de ubicación, mover el evento
        if (eventData.locationId && eventData.locationId !== locationId) {
          console.log(`📍 Moviendo evento de ubicación ${locationId} a ${eventData.locationId}`)

          // Remover de la ubicación anterior
          events.splice(eventIndex, 1)
          this.events.set(locationId, events)

          // Agregar a la nueva ubicación
          const newLocationEvents = this.events.get(eventData.locationId) || []
          newLocationEvents.push(updatedEvent)
          this.events.set(eventData.locationId, newLocationEvents)
        } else {
          // Actualizar en la misma ubicación
          events[eventIndex] = updatedEvent
          this.events.set(locationId, events)
        }

        console.log('✅ Evento actualizado exitosamente:', updatedEvent)
        return updatedEvent
      }
    }

    console.error('❌ Evento no encontrado para actualizar:', id)
    return null
  }

  deleteEvent (id: string): boolean {
    // Buscar y eliminar el evento en todas las ubicaciones
    const locationIds = Array.from(this.events.keys())

    for (const locationId of locationIds) {
      const events = this.events.get(locationId) || []
      const eventIndex = events.findIndex((e: CalendarEvent) => e.id === id)

      if (eventIndex !== -1) {
        events.splice(eventIndex, 1)
        this.events.set(locationId, events)
        console.log('🗑️ Evento eliminado:', id)
        return true
      }
    }

    console.warn('⚠️ Evento no encontrado para eliminar:', id)
    return false
  }
}

// Instancia global del store
const mockEventStore = new MockEventStore()

// ============================
// FUNCIÓN ESPECÍFICA PARA CUSTOMERS ACTIVOS
// ============================
export const getActiveCustomersForCalendar = async (): Promise<User[]> => {
  try {
    const response = await getCustomersV2({
      pageIndex: 1,
      pageSize: 100,
      orderBy: 'insert_date',
      sortBy: 'DESC',
      fields: 'name_customer,email_customer,phone_customer',
      filters: {
        status_customer: 'active'
      }
    })

    // Mapear CustomerResponseModel a User
    return response.data.map(customer => ({
      id: customer.id.toString(),
      name: customer.name_customer || '',
      email: customer.email_customer || '',
      phone: customer.phone_customer || ''
    }))
  } catch (error) {
    console.error('Error fetching customers:', error)
    // Fallback a datos mock en caso de error
    return mockUsers
  }
}

// ============================
// FUNCIÓN ESPECÍFICA PARA SERVICIOS ACTIVOS POR UBICACIÓN
// ============================
export const getActiveServicesForCalendar = async (locationId: string): Promise<Service[]> => {
  try {
    const response = await getServicesV2({
      location_id: locationId,
      pageIndex: 1,
      pageSize: 100,
      orderBy: 'service_name',
      sortBy: 'ASC',
      fields: 'service_name,duration_minutes,price,category_name'
    })

    // Mapear ServiceResponseModel a Service
    return response.data.map(service => ({
      id: service.service_id.toString(),
      name: service.service_name || '',
      duration: service.duration_minutes || 30,
      price: service.price || 0,
      category: service.category_name || 'Sin categoría'
    }))
  } catch (error) {
    console.error('Error fetching services:', error)
    // Fallback a datos mock en caso de error
    return mockServices
  }
}

// ============================
// FUNCIÓN ESPECÍFICA PARA ESTADOS DEL CALENDARIO
// ============================
export const getCalendarStatusOptions = async (): Promise<StatusOption[]> => {
  try {
    const response = await getMaintableV2({
      table_name: 'StatusCitaCalendario',
      pageIndex: 1,
      pageSize: 100,
      orderBy: 'item_order',
      sortBy: 'ASC',
      fields: 'maintable_id,item_text,item_value'
    })

    // Mapear MaintableResponseModel a StatusOption
    return response.data.map(status => ({
      id: status.maintable_id.toString(),
      label: status.item_text || '',
      value: status.item_value || ''
    }))
  } catch (error) {
    console.error('Error fetching calendar status options:', error)
    // Fallback a opciones hardcodeadas en caso de error
    return [
      { id: '5', label: 'Reservada', value: '1' },
      { id: '6', label: 'Confirmada', value: '2' },
      { id: '7', label: 'Finalizado', value: '3' },
      { id: '8', label: 'Cancelar', value: '4' }
    ]
  }
}

// ============================
// MOCK API SERVICE CON MANEJO MEJORADO DE ERRORES
// ============================
export const mockCalendarAPI = {
  // ============================
  // EVENTOS
  // ============================
  getEvents: async (locationId: string): Promise<CalendarEvent[]> => {
    console.log(`📅 Obteniendo eventos para ubicación: ${locationId}`)

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800))

    const events = mockEventStore.getEvents(locationId)
    console.log(`✅ ${events.length} eventos encontrados para ubicación ${locationId}`)

    return events
  },

  // ============================
  // OPERACIONES CRUD
  // ============================
  createEvent: async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    console.log('📝 Creando nuevo evento:', eventData)

    try {
      // Validar datos requeridos
      if (!eventData.title || !eventData.start || !eventData.locationId) {
        throw new Error('Faltan datos requeridos para crear el evento')
      }

      // Simular delay de operación
      await new Promise(resolve => setTimeout(resolve, 500))

      const newEvent = mockEventStore.createEvent(eventData)
      console.log('✅ Evento creado exitosamente:', newEvent)

      return newEvent
    } catch (error) {
      console.error('❌ Error creando evento:', error)
      throw error
    }
  },

  updateEvent: async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    console.log(`✏️ Actualizando evento ${id}:`, eventData)

    try {
      // Validar ID
      if (!id) {
        throw new Error('ID del evento es requerido para actualizar')
      }

      // Simular delay de operación
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedEvent = mockEventStore.updateEvent(id, eventData)

      if (!updatedEvent) {
        throw new Error(`Evento con ID ${id} no encontrado`)
      }

      console.log('✅ Evento actualizado exitosamente:', updatedEvent)
      return updatedEvent
    } catch (error) {
      console.error('❌ Error actualizando evento:', error)
      throw error
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    console.log(`🗑️ Eliminando evento: ${id}`)

    try {
      // Validar ID
      if (!id) {
        throw new Error('ID del evento es requerido para eliminar')
      }

      // Simular delay de operación
      await new Promise(resolve => setTimeout(resolve, 500))

      const success = mockEventStore.deleteEvent(id)

      if (!success) {
        throw new Error(`Evento con ID ${id} no encontrado`)
      }

      console.log('✅ Evento eliminado exitosamente')
    } catch (error) {
      console.error('❌ Error eliminando evento:', error)
      throw error
    }
  },

  // ============================
  // CATÁLOGOS
  // ============================
  getUsers: async (): Promise<User[]> => {
    console.log('👥 Obteniendo usuarios para calendario')
    return getActiveCustomersForCalendar()
  },

  getServices: async (locationId?: string): Promise<Service[]> => {
    console.log(`🛠️ Obteniendo servicios para ubicación: ${locationId}`)

    if (locationId) {
      return getActiveServicesForCalendar(locationId)
    }
    // Fallback a datos mock si no hay locationId
    console.log('⚠️ Sin locationId, usando servicios mock')
    return mockServices
  },

  getBarbers: async (locationId: string): Promise<Barber[]> => {
    console.log(`💇‍♂️ Obteniendo barberos para ubicación: ${locationId}`)

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const barbers = mockBarbers.filter(barber =>
      barber.locationIds.includes(locationId)
    )

    console.log(`✅ ${barbers.length} barberos encontrados para ubicación ${locationId}`)
    return barbers
  }
}
