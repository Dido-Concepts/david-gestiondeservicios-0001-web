'use client'

import React, { useState, useCallback } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { IconComponent, IconsName } from '@/app/components'

export type ComboboxInfiniteItem = {
  id: string | number
  label: string
  icon: IconsName
}

export type ComboboxInfiniteQueryMethods = {
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
}

export type ComboboxPopoverInfiniteProps = {
  label: string
  data: ComboboxInfiniteItem[]
  onSelect: (selected: ComboboxInfiniteItem | null) => void
  queryMethods: ComboboxInfiniteQueryMethods
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedValue?: ComboboxInfiniteItem | null
  placeholder?: string
  emptyText?: string
  loadingText?: string
  loadingMoreText?: string
  searchPlaceholder?: string
}

export function ComboboxPopoverInfinite ({
  label,
  data,
  onSelect,
  queryMethods,
  searchQuery,
  onSearchChange,
  selectedValue = null,
  placeholder = 'Seleccionar...',
  emptyText = 'No se encontraron resultados.',
  loadingText = 'Cargando...',
  loadingMoreText = 'Cargando más...',
  searchPlaceholder = 'Buscar...'
}: ComboboxPopoverInfiniteProps) {
  const [open, setOpen] = useState(false)

  // Función para cargar más páginas cuando se haga scroll
  const handleLoadMore = useCallback(() => {
    if (queryMethods.hasNextPage && !queryMethods.isFetchingNextPage) {
      queryMethods.fetchNextPage()
    }
  }, [queryMethods])

  // Manejar scroll en la lista para lazy loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100

    // Cargar más cuando esté al 85% del final
    if (scrollPercentage >= 85) {
      handleLoadMore()
    }
  }, [handleLoadMore])

  const handleSelect = (selected: ComboboxInfiniteItem) => {
    onSelect(selected)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
      <p className="text-base text-muted-foreground font-semibold shrink-0">
        {label}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between sm:w-[180px] lg:w-[200px]"
          >
            {selectedValue
              ? (
              <div className="flex items-center">
                <IconComponent
                  name={selectedValue.icon}
                  className="mr-2 h-4 w-4 shrink-0"
                />
                <span className="truncate">{selectedValue.label}</span>
              </div>
                )
              : (
              <span className="text-muted-foreground">{placeholder}</span>
                )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          side="bottom"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={onSearchChange}
            />
            <CommandList onScroll={handleScroll}>
              <CommandEmpty>
                {queryMethods.isLoading ? loadingText : emptyText}
              </CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label}
                    onSelect={() => handleSelect(item)}
                  >
                    {selectedValue?.id === item.id && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    <IconComponent
                      name={item.icon}
                      className="mr-2 h-4 w-4 text-muted-foreground"
                    />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
                {queryMethods.isFetchingNextPage && (
                  <CommandItem disabled>
                    <div className="flex items-center gap-2 py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>{loadingMoreText}</span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
