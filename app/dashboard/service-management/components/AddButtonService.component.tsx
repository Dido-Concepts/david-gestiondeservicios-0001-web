'use client'

import { IconComponent } from '@/app/components/Icon.component'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useModalCategory } from '@/modules/service/infra/store/category-modal.store'
import { useModalService } from '@/modules/service/infra/store/service-modal.store'

export default function AddButtonService () {
  const { setCategory, toggleModal } = useModalCategory()
  const { setService, toggleModal: toggleModalService } = useModalService()

  const handleCreateCategory = () => {
    setCategory(null)
    toggleModal()
  }

  const handleCreateService = () => {
    setService(null)
    toggleModalService()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Añadir
          <IconComponent
            name="plus"
            width={20}
            height={20}
            className="w-6 h-6 ml-2"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCreateService}>
            <IconComponent
              name="fluent:glance-horizontal-sparkles-24-filled"
              width={20}
              height={20}
              className="w-6 h-6 ml-2"
            />
            <span>Servicio</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateCategory}>
            <IconComponent
              name="mdi:tag-plus"
              width={20}
              height={20}
              className="w-6 h-6 ml-2"
            />
            <span>Categoría</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
