import { IconComponent } from '@/app/components/Icon.component'
import { mockReportData } from './mock/report.mock'

export default function Page () {
  return (
    <main className="container mx-auto p-0 space-y-6">
      {/* Sección de título ocupando todo el ancho */}
      <div className="w-full">
        <div className="py-2 md:text-4xl text-2xl font-bold px-5">Reportes</div>
      </div>

      {/* Sección de reportes */}
      <div className="w-full grid grid-cols-3 gap-6 px-5">
        {mockReportData.reports.map((report) => (
          <div key={report.id} className="bg-white p-5 rounded-lg shadow flex items-start space-x-4">
            <IconComponent name="calendar" className="text-purple-600" />
            <div>
              <h3 className="font-semibold text-lg">{report.title}</h3>
              <p className="text-gray-600 text-sm">{report.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
