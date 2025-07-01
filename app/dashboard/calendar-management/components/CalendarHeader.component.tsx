import React from 'react'

// ============================
// PROPS INTERFACE
// ============================
interface CalendarHeaderProps {
  locationFilter: string
  eventCount: number
}

// ============================
// COMPONENTE HEADER
// ============================
export const CalendarHeader: React.FC<CalendarHeaderProps> = React.memo(({ locationFilter, eventCount }) => (
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">
      📅 Calendario - Ubicación {locationFilter}
    </h2>
    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
      {eventCount} citas
    </div>
  </div>
))

CalendarHeader.displayName = 'CalendarHeader'
