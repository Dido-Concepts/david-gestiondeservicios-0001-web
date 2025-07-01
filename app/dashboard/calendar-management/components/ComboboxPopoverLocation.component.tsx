'use client'

import { ComboboxPopover, ComboboxProps, IconsName } from '@/app/components'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export default function ComboboxPopoverLocation () {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Usar el mismo patrón que FilterSede - simple y rápido
  const { data: locations } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () => getLocationsCatalog()
  })

  // Transformar datos una sola vez (igual que FilterSede)
  const itemsLocationCombobox = useMemo(() =>
    locations.map((location) => ({
      label: location.name,
      value: location.id.toString(),
      icon: 'store' as IconsName
    })), [locations]
  )

  const currentSelectedLocationValue = searchParams.get('locationFilter')
  const initialValue = itemsLocationCombobox.find(item => item.value === currentSelectedLocationValue) || undefined

  // Manejar selección - Idéntico al patrón de FilterSede
  const handleLocationSelect = useCallback((selected: ComboboxProps | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selected?.value) {
      params.set('locationFilter', selected.value)
    } else {
      params.delete('locationFilter')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  return (
    <ComboboxPopover
      label="Ubicación"
      items={itemsLocationCombobox}
      initialValue={initialValue}
      onSelect={handleLocationSelect}
    />
  )
}
