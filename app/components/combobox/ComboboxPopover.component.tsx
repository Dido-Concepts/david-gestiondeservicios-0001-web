'use client'

import { IconComponent, IconsName } from '@/app/components'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export type ComboboxProps = {
  value: string
  label: string
  icon: IconsName
}

export function ComboboxPopover (props: {
  label: string
  items: ComboboxProps[]
  initialValue?: ComboboxProps
  onSelect?: (selected: ComboboxProps | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ComboboxProps | null>(
    props.initialValue || null
  )

  const handleSelect = (selected: ComboboxProps | null) => {
    setSelectedStatus(selected)
    setOpen(false)
    if (props.onSelect) {
      props.onSelect(selected)
    }
  }

  return (
    <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
      <p className="text-base text-muted-foreground font-semibold shrink-0">
        {props.label}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start sm:w-[180px] lg:w-[200px]"
          >
            {selectedStatus
              ? (
                <>
                  <IconComponent
                    name={selectedStatus.icon}
                    className="mr-2 h-4 w-4 shrink-0"
                  />
                  <span className="truncate">{selectedStatus.label}</span>
                </>
                )
              : (
                <>+ Cambiar {props.label}</>
                )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          side="bottom"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Buscar ${props.label}...`} />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {props.items.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.label}
                    onSelect={(currentLabel) => {
                      const selected = props.items.find(
                        (item) =>
                          item.label.toLowerCase() === currentLabel.toLowerCase()
                      ) || null
                      handleSelect(selected)
                    }}
                  >
                    <IconComponent
                      name={status.icon}
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        status.value === selectedStatus?.value
                          ? 'opacity-100'
                          : 'opacity-40'
                      )}
                    />
                    <span>{status.label}</span>
                    <span
                      className={cn(
                        'ml-auto pl-2',
                        status.value === selectedStatus?.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    >
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
