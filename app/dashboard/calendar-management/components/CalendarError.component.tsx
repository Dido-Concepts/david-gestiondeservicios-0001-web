import React from 'react'

// ============================
// COMPONENTE DE ERROR
// ============================
export const CalendarError: React.FC = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-red-500 text-center">
      <div className="mb-2">❌ Error al cargar el calendario</div>
      <div className="text-sm text-gray-600">Intenta refrescar la página</div>
    </div>
  </div>
)
