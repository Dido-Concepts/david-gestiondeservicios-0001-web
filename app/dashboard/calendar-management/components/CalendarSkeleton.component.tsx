import React from 'react'

// ============================
// SKELETON DEL CALENDARIO
// ============================
export const CalendarSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="flex justify-between items-center">
      <div className="h-7 bg-gray-200 rounded w-64"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>

    {/* Content skeleton */}
    <div className="flex gap-6">
      {/* Lista de eventos skeleton */}
      <div className="w-1/4 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendario skeleton */}
      <div className="flex-1">
        <div className="border rounded-lg p-4">
          {/* Header del calendario */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          {/* Grid del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {/* Días de la semana */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                {day}
              </div>
            ))}

            {/* Días del mes */}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded border border-gray-100">
                <div className="p-1">
                  <div className="h-4 bg-gray-200 rounded w-6 mb-1"></div>
                  {Math.random() > 0.7 && (
                    <div className="h-3 bg-blue-200 rounded w-full mb-1"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)
