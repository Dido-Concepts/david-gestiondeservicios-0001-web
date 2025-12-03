'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FiltersPanel } from '@/app/dashboard/report-management/report-quotes/components/FiltersPanel'

interface FiltersPopoverProps {
  disabled?: boolean
  onApplyFilters: (filters: { barbero_id?: number; sede_id?: number; status_id?: number }) => void
  onClearAllFilters: () => void
}

export function FiltersPopover ({ disabled = false, onApplyFilters, onClearAllFilters }: FiltersPopoverProps) {
  const [filtersOpen, setFiltersOpen] = React.useState(false)

  const handleFiltersClose = () => setFiltersOpen(false)

  const handleApplyFilters = (filters: { barbero_id?: number; sede_id?: number; status_id?: number }) => {
    onApplyFilters(filters)
    handleFiltersClose()
  }

  const handleClearAllFilters = () => {
    onClearAllFilters()
  }

  return (
    <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'bg-white border border-gray-300 px-4 py-2 rounded-lg',
            !disabled
              ? 'text-gray-700 hover:bg-gray-50'
              : 'text-gray-400 cursor-not-allowed opacity-50'
          )}
        >
          Filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <FiltersPanel
          onClose={handleFiltersClose}
          onApply={handleApplyFilters}
          onClearAll={handleClearAllFilters}
        />
      </PopoverContent>
    </Popover>
  )
}
