'use client'

import React from 'react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRangePicker } from '@/app/dashboard/report-management/report-quotes/components/DateRangePicker'

interface DateRangePopoverProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
}

export function DateRangePopover ({ dateRange, onDateRangeChange }: DateRangePopoverProps) {
  const [dateOpen, setDateOpen] = React.useState(false)

  const handleDatePopoverClose = () => {
    setDateOpen(false)
  }

  return (
    <Popover open={dateOpen} onOpenChange={setDateOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg justify-start text-left font-normal',
            !dateRange?.from && !dateRange?.to && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from && dateRange?.to
            ? (
            `${format(dateRange.from, 'PPP', { locale: es })} - ${format(dateRange.to, 'PPP', { locale: es })}`
              )
            : (
            <span className="text-gray-700">Elige una fecha</span>
              )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DateRangePicker
          selectedRange={dateRange}
          onSelectRange={onDateRangeChange}
          onClose={handleDatePopoverClose}
        />
      </PopoverContent>
    </Popover>
  )
}
