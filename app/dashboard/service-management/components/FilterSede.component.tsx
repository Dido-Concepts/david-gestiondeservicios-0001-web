'use client'

import { ComboboxPopover, ComboboxProps, IconsName } from '@/app/components'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useEffect, useState } from 'react'

export function FilterSede () {
  const { data: locations } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () =>
      getLocationsCatalog()
  })

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Estado para manejar la hidratación
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const itemsLocationCombobox = useMemo(() =>
    locations.map((location) => ({
      label: location.name,
      value: location.id.toString(),
      icon: 'store' as IconsName
    })), [locations]
  )

  const currentSelectedLocationValue = isClient ? searchParams.get('locationFilter') : null
  const initialValue = currentSelectedLocationValue
    ? itemsLocationCombobox.find(item => item.value === currentSelectedLocationValue) || null
    : null

  // Efecto para establecer la primera ubicación si no hay ninguna seleccionada
  useEffect(() => {
    if (!isClient || !itemsLocationCombobox.length) return

    const currentFilter = searchParams.get('locationFilter')

    if (!currentFilter && itemsLocationCombobox.length > 0) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('locationFilter', itemsLocationCombobox[0].value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [isClient, itemsLocationCombobox, searchParams, pathname, router])

  const handleLocationSelect = useCallback((selected: ComboboxProps | null) => {
    if (!isClient) return

    const params = new URLSearchParams(searchParams.toString())

    if (selected?.value) {
      params.set('locationFilter', selected.value)
    } else {
      params.delete('locationFilter')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams, isClient])

  // Mostrar un placeholder durante la hidratación
  if (!isClient) {
    return (
      <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <p className="text-base text-muted-foreground font-semibold shrink-0">Sede</p>
        <div className="w-full sm:w-[180px] lg:w-[200px] h-9 bg-muted rounded-md animate-pulse" />
      </div>
    )
  }

  return (
    <ComboboxPopover
        label='Sede'
        items={itemsLocationCombobox}
        initialValue={initialValue || undefined}
        onSelect={handleLocationSelect}
    />
  )
}
