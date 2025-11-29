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
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
    <h2 className="text-base sm:text-xl font-semibold truncate max-w-full">
      📅 Calendario - Ubicación {locationFilter}
    </h2>
    <div className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
      {eventCount} citas
    </div>
  </div>
))

CalendarHeader.displayName = 'CalendarHeader'
