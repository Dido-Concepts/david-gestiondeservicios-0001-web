import React from 'react'
import { IconComponent } from '@/app/components/Icon.component'
import Link from 'next/link'

export default function ReportQuotesPage () {
  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 text-gray-600">
        {/* Botón de atrás */}
        <Link
          className="flex items-center w-min px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
          href="/dashboard/report-management"
          passHref
        >
          <IconComponent
            name="arrow"
            width={20}
            height={20}
            className="w-6 h-6 mr-2"
          />
          Atrás
        </Link>
      </div>

      {/* Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Resumen de citas</h1>
        <p className="text-gray-600">
          Reporte general de las citas  filtrando por día, semana, mes, por barbero y por cliente
        </p>
      </div>

      {/* Filters and Options */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Mes actual</button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Filtros</button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">Descargar</button>
        </div>
      </div>
    </main>
  )
}
