import Cell from '@/app/dashboard/user-management/components/CellShiftManagement.component'

export default function ShiftManagementPage () {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">Gestionar turnos</h1>
        </div>
      </div>

      <div className="container mx-auto py-10 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left">Miembro del equipo</th>
              <th className="p-3">Dom, 5 Ene</th>
              <th className="p-3">Lun, 6 Ene</th>
              <th className="p-3">Mar, 7 Ene</th>
              <th className="p-3">Mié, 8 Ene</th>
              <th className="p-3">Jue, 9 Ene</th>
              <th className="p-3">Vie, 10 Ene</th>
              <th className="p-3">Sáb, 11 Ene</th>
            </tr>
          </thead>
          <tbody>
            {['Demetrio Vázquez', 'Beto Cerv', 'Wendy Smith'].map((name, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{name}</span>
                </td>
                {['10:00 - 17:00', '09:00 - 19:00', '09:00 - 19:00', '09:00 - 19:00', '09:00 - 19:00', '09:00 - 19:00', '10:00 - 17:00'].map((shift, i) => (
                  <td key={i}>
                    <Cell shift={shift} id={`${index}-${i}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
