'use client'

import { ComboboxPopover, ComboboxProps } from '@/app/components'
import { getLocationsCatalog } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function FilterSede () {
  const { data: locations } = useSuspenseQuery({
    queryKey: [QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocationCatalog],
    queryFn: () =>
      getLocationsCatalog()
  })

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const itemsLocationCombobox: ComboboxProps[] = locations.map((location) => ({
    label: location.name,
    value: location.id.toString(),
    icon: 'store'
  }))

  const currentSelectedLocationValue = searchParams.get('locationFilter')
  const initialValue = itemsLocationCombobox.find(item => item.value === currentSelectedLocationValue) || itemsLocationCombobox[0] || null

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const currentLocationFilter = params.get('locationFilter')

    if (initialValue && initialValue.value && currentLocationFilter !== initialValue.value) {
      params.set('locationFilter', initialValue.value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [initialValue, locations, pathname, router, searchParams])

  const handleLocationSelect = (selected: ComboboxProps | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selected && selected.value) {
      params.set('locationFilter', selected.value)
    } else {
      params.delete('locationFilter')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <ComboboxPopover
        label='Sede'
        items={itemsLocationCombobox}
        initialValue={initialValue}
        onSelect={handleLocationSelect}
    />
  )
}
