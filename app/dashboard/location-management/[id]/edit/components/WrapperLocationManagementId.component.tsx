'use client'

import { IconComponent } from '@/app/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocationById } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from '@formkit/tempo'

import Link from 'next/link'
import { EditButtonAndModalLocationDetails } from './EditButtonAndModalLocationDetails.component'
import { EditButtonAndModalLocationOpeningHours } from './EditButtonAndModalLocationOpeningHours.component'

export function WrapperLocationManagementId (param: { id: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, param.id],
    queryFn: () => getLocationById(param.id)
  })

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

      <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>

      {/* Datos de Contacto */}
      <Card className="p-4">
        <CardHeader className="flex justify-between items-start relative">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Datos de la sede
          </CardTitle>
          <div className="absolute right-6 top-6">
            <EditButtonAndModalLocationDetails location={data} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 ">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={data.imageUrl}
                  alt={`Imagen de ${data.name}`}
                />
                <AvatarFallback>Imagen del Local</AvatarFallback>
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
                <strong>Teléfono del centro:</strong> &nbsp; {data.phone}
              </p>
              <p>
                <strong>Fecha de registro:</strong> &nbsp; {format(data.registrationDate, { date: 'full' })}
              </p>
              <p>
                <strong>Direccion del local:</strong> &nbsp; {data.address}
              </p>
              <p>
                <strong>Referencia del local:</strong> &nbsp; {data.review}
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
            <EditButtonAndModalLocationOpeningHours schedule={data.openingHours} />
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
            {data.openingHours.map((hour) => (

              <div key={hour.day} className="flex flex-col items-center p-3 bg-purple-100 text-app-secondary rounded-md">
                <span className="font-medium capitalize">{hour.day}</span>
                {
                  hour.ranges.length > 0
                    ? hour.ranges.map((range) => (
                      <span key={range.start} className="text-sm">
                        {range.start} - {range.end}
                      </span>
                    ))
                    : 'No registrado aún'
                }
              </div >
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
