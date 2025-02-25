import ShiftManagementContainer from '@/app/dashboard/user-management/components/ShiftManagementContainer.component'

export default function ShiftManagementPage () {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">Gestionar turnos</h1>
        </div>
      </div>

      {/* Contenedor que maneja la selección de semana y la tabla */}
      <ShiftManagementContainer />
    </>
  )
}
