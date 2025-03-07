import { IconComponent } from '@/app/components/Icon.component'

export default function Page () {
  return (
    <main className="container mx-auto p-0 space-y-6">
      {/* Sección de título ocupando todo el ancho */}
      <div className="w-full">
        <div className="py-10 text-2xl font-bold px-5">Reportes</div>
      </div>

      {/* Sección de reportes */}
      <div className="w-full grid grid-cols-3 gap-6 px-5">
        {/* Tarjeta 1: Resumen de citas */}
        <div className="bg-white p-5 rounded-lg shadow flex items-start space-x-4">
          <IconComponent name="calendar" className="text-purple-600" />
          <div>
            <h3 className="font-semibold text-lg">Resumen de citas</h3>
            <p className="text-gray-600 text-sm">
              Resumen general de las tendencias y patrones de las citas, incluyendo cancelaciones e inasistencias.
            </p>
          </div>
        </div>

        {/* Tarjeta 2: Lista de citas */}
        <div className="bg-white p-5 rounded-lg shadow flex items-start space-x-4">
          <IconComponent name="calendar" className="text-purple-600" />
          <div>
            <h3 className="font-semibold text-lg">Lista de citas</h3>
            <p className="text-gray-600 text-sm">
              Lista completa de citas programadas.
            </p>
          </div>
        </div>

        {/* Tarjeta 3: Resumen de citas canceladas e inasistencias */}
        <div className="bg-white p-5 rounded-lg shadow flex items-start space-x-4">
          <IconComponent name="calendar" className="text-purple-600" />
          <div>
            <h3 className="font-semibold text-lg">Resumen de citas canceladas e inasistencias</h3>
            <p className="text-gray-600 text-sm">
              Resumen de las cancelaciones de citas y las inasistencias.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
