import React from 'react'
import DynamicTable from '@/app/components/table/DynamicTable.component'
import AddButtonService from '@/app/dashboard/service-management/components/AddButtonService.component'

export default function Page () {
  return (
  <main className="container mx-auto p-4 space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
          Gestionar categorías y servicios
        </h1>
        <p className="text-app-primary">
           Añade, edita o elimina las categorías y los servicios de su negocio
        </p>
      </div>
      <div className="flex space-x-2">
        <AddButtonService />
      </div>
    </div>

    <DynamicTable />
  </main>
  )
}
