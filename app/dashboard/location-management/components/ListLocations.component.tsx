'use client'

import { getLocations } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'

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
import { LocationModel } from '@/modules/location/domain/models/location.model'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { ActionMenuChangeStatusLocation } from './ActionMenuChangeStatusLocation.component'

function ContentLink (param: { location: Omit<LocationModel, 'openingHours'> }) {
  console.log(param.location.status)
  return (
    <Card
      className={`
            flex flex-col md:flex-row items-start md:items-center p-4 space-y-4 md:space-y-0 md:space-x-4  ${
              param.location.status
                ? 'bg-gray-100 opacity-50'
                : 'cursor-pointer transition-shadow hover:shadow-lg'
            }`}
    >
      <div className="w-full md:w-1/3 h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {param.location.imageUrl
          ? (
          <img
            src={param.location.imageUrl}
            alt={param.location.name}
            className="w-full h-full object-cover"
          />
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
            {param.location.name}
          </CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-500">{param.location.address}</p>
        <p className="text-sm text-gray-500">{param.location.review}</p>
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
            {!param.location.status
              ? (
              <Link
                href={`/dashboard/location-management/${param.location.id}/edit`}
              >
                <DropdownMenuItem>Editar</DropdownMenuItem>
              </Link>
                )
              : (
              <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                )}

            <ActionMenuChangeStatusLocation nameLocation={param.location.name} status={param.location.status} idLocation={String(param.location.id)} />

          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

export function ListLocations (param: { pageIndex: number; pageSize: number }) {
  const { data } = useSuspenseQuery({
    queryKey: [
      QUERY_KEYS_LOCATION_MANAGEMENT.LMListLocations,
      param.pageIndex,
      param.pageSize
    ],
    queryFn: () =>
      getLocations({ pageIndex: param.pageIndex, pageSize: param.pageSize })
  })

  const { toast } = useToast()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    if (error === 'not_found') {
      toast({
        title: 'Error',
        description: 'No se encontró la sede',
        variant: 'destructive'
      })
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [error, toast])

  return (
    <>
      {data.data.map((location) => (
        <div key={location.id}>
          {location.status
            ? (
            <ContentLink location={location} />
              )
            : (
            <Link href={`/dashboard/location-management/${location.id}/edit`}>
              <ContentLink location={location} />
            </Link>
              )}
        </div>
      ))}
    </>
  )
}
