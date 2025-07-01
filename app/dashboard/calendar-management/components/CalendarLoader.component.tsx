import React from 'react'

// ============================
// COMPONENTE DE LOADING
// ============================
export const CalendarLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-96 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    <div className="text-center">
      <div className="text-lg font-medium text-gray-700">Cargando calendario...</div>
      <div className="text-sm text-gray-500">Obteniendo citas de la ubicación seleccionada</div>
    </div>
  </div>
)
