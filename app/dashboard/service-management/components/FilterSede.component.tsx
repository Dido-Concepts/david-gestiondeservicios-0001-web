'use client'

import { ComboboxPopover, ComboboxProps, IconsName } from '@/app/components'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useCallback, useMemo } from 'react'

export function FilterSede () {
  const { data: locations } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () =>
      getLocationsCatalog()
  })

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const itemsLocationCombobox = useMemo(() =>
    locations.map((location) => ({
      label: location.name,
      value: location.id.toString(),
      icon: 'store' as IconsName
    })), [locations]
  )

  const currentSelectedLocationValue = searchParams.get('locationFilter')
  const initialValue = itemsLocationCombobox.find(item => item.value === currentSelectedLocationValue) || itemsLocationCombobox[0] || null

  useEffect(() => {
    if (!initialValue?.value) return

    const params = new URLSearchParams(searchParams.toString())
    const currentLocationFilter = params.get('locationFilter')

    if (currentLocationFilter !== initialValue.value) {
      params.set('locationFilter', initialValue.value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [initialValue?.value, pathname, router, searchParams])

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
        label='Sede'
        items={itemsLocationCombobox}
        initialValue={initialValue}
        onSelect={handleLocationSelect}
    />
  )
}
