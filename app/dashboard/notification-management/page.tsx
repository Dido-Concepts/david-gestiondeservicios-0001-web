import { IconComponent } from '@/app/components/Icon.component'
export default function Page () {
  return (
    <main className="container mx-auto p-0 space-y-6">
      {/* Sección de título ocupando todo el ancho */}
      <div className="w-full">
        <div className="py-10 text-2xl font-bold px-5">Recordatorios</div>
      </div>

      {/* Sección de tarjetas ocupando todo el ancho */}
      <div className="w-full grid grid-cols-3 gap-6 px-5">
        {/* Tarjeta 1 */}
        <div className="border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-orange-500 text-2xl">🔔</span>
            {/* Botón de elipsis (⋮) */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <IconComponent name="ellipsis" width={20} height={20} className="w-6 h-6 ml-2" />
            </button>
          </div>
          <h3 className="text-lg font-semibold">Recordatorio de próxima cita 24 horas antes</h3>
          <p className="text-gray-500 text-sm">
            Envía una notificación a los clientes para recordarles cuándo es su próxima cita.
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">Activo</span>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-orange-500 text-2xl">🔔</span>
            {/* Botón de elipsis (⋮) */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <IconComponent name="ellipsis" width={20} height={20} className="w-6 h-6 ml-2" />
            </button>
          </div>
          <h3 className="text-lg font-semibold">Recordatorio de próxima cita 1 hora antes</h3>
          <p className="text-gray-500 text-sm">
            Envía una notificación a los clientes para recordarles cuándo es su próxima cita.
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">Activo</span>
          </div>
        </div>

        {/* Tarjeta "Crear nuevo" */}
        <div className="border border-gray-300 shadow-sm rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
          <span className="text-purple-500 text-3xl">➕</span>
          <span className="text-purple-600 font-semibold">Crear nuevo</span>
        </div>
      </div>
    </main>
  )
}
