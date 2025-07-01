// ============================
// EXPORTACIONES DE COMPONENTES
// ============================
export { CalendarLoader } from './CalendarLoader.component'
export { CalendarError } from './CalendarError.component'
export { CalendarHeader } from './CalendarHeader.component'
export { CalendarEventsList } from './CalendarEventsList.component'
export { CreateEventModal } from './CreateEventModal.component'
export { CalendarSkeleton } from './CalendarSkeleton.component'

// ============================
// EXPORTACIONES DE SERVICIOS Y TIPOS
// ============================
export {
  mockCalendarAPI,
  getActiveCustomersForCalendar,
  getActiveServicesForCalendar,
  getCalendarStatusOptions,
  type CalendarEvent,
  type User,
  type Service,
  type Barber,
  type StatusOption
} from './CalendarAPI.service'
