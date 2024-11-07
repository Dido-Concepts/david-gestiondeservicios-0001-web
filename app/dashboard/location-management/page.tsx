'use client'

import { AddButtonLocation } from '@/app/dashboard/location-management/components/AddButtonLocation.component'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { mockLocationData } from '@/modules/location/infra/mock/location.mock'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function SedesManagementPage () {
  return (
    <main className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
            Gestionar sedes
          </h1>
          <p className="text-app-primary">
            Gestiona la información y las preferencias de las sedes de tu
            negocio
          </p>
        </div>
        <div className="flex space-x-2">
          <AddButtonLocation />
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockLocationData.locations.map((location) => (
          <Link
            key={location.id}
            href={`/dashboard/location-management/${location.id}/edit`}
            passHref
          >
            <Card className="flex flex-col md:flex-row items-start md:items-center p-4 space-y-4 md:space-y-0 md:space-x-4 cursor-pointer transition-shadow hover:shadow-lg">
              <div className="w-full md:w-1/3 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {location.imageUrl
                  ? (
                    <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
                    )
                  : (
                  <svg
                    className="w-12 h-12 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h18v18H3V3z"
                    ></path>
                  </svg>
                    )}
              </div>

              <CardContent className="w-full md:w-2/3">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg font-bold">
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-600">
                  {location.address}, {location.city}, {location.province}
                </p>
                <p className="text-sm text-gray-500">Aún no hay reseñas</p>
              </CardContent>
              <CardFooter className="mt-4 md:mt-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Acciones
                      <MoreHorizontal className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Ver</DropdownMenuItem>
                    <DropdownMenuItem>Desactivar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
//
