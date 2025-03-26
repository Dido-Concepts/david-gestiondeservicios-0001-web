import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { mockLocationData } from '@/modules/location/infra/mock/location.mock'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconComponent } from '@/app/components'
import { EditButtonAndModalLocationDetails } from '@/app/dashboard/location-management/[id]/edit/components/EditButtonAndModalLocationDetails.component'
import { EditButtonAndModalLocationOpeningHours } from '@/app/dashboard/location-management/[id]/edit/components/EditButtonAndModalLocationOpeningHours.component'

export default function EditLocationPage ({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const location = mockLocationData.locations.find(
    (location) => location.id === id
  )

  if (!location) {
    return <p>Location not found</p>
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Botón de atrás */}
      <Link
        className="flex items-center w-min px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
        href="/dashboard/location-management"
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

      <h1 className="text-3xl font-bold text-gray-800">{location.name}</h1>

      {/* Datos de Contacto */}
      <Card className="p-4">
        <CardHeader className="flex justify-between items-start relative">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Datos de la sede
          </CardTitle>
          <div className="absolute right-6 top-6">
            <EditButtonAndModalLocationDetails />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={location.imageUrl}
                  alt={`Imagen de ${location.name}`}
                />
                <AvatarFallback>IC</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Imagen del centro
                </p>
                {/* <Link
                  href="#"
                  className="text-sm text-app-secondary hover:underline"
                >
                  Cambiar imagen
                </Link> */}
              </div>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Teléfono del centro:</strong> {location.phone}
              </p>
              <p>
                <strong>Dirección del centro:</strong> {location.address},{' '}
                {location.city}, {location.province}
              </p>
              <p>
                <strong>Fecha de registro:</strong> {location.registrationDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horario de Atención */}
      <Card className="p-4">
        <CardHeader className="flex justify-between items-start relative">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Horario de atención
          </CardTitle>
          <div className="absolute right-6 top-6">
            <EditButtonAndModalLocationOpeningHours />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            El horario de atención de estos centros es, por defecto, el horario
            laboral de tu equipo y tus clientes podrán verlo. Puedes modificar
            las fechas de cierre para los días festivos, entre otros, en{' '}
            <Link href="#" className="text-app-secondary underline">
              Ajustes
            </Link>
            .
          </p>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {location.openingHours.map((hour) => (
              <div
                key={hour.day}
                className="flex flex-col items-center p-3 bg-purple-100 text-app-secondary rounded-md"
              >
                <span className="font-medium capitalize">{hour.day}</span>
                <span className="text-sm">
                  {hour.open && hour.close
                    ? `${new Date(hour.open * 1000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - ${new Date(hour.close * 1000).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                      )}`
                    : 'Cerrado'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
