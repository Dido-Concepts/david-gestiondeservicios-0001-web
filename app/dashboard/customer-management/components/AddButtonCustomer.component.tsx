'use client'

import { IconComponent } from '@/app/components'
import { useCustomerModal } from '@/modules/customer/infra/store/customer-modal.store'
import { Button } from '@/components/ui/button'

export function AddButtonCustomer () {
  const { toggleModal, setCustomer } = useCustomerModal()

  const handleCreateCustomer = () => {
    setCustomer(null)
    toggleModal()
  }

  return (
    <Button
      variant="default"
      className="bg-app-quaternary text-white hover:bg-gray-600"
      onClick={handleCreateCustomer}
    >
      Añadir Cliente
      <IconComponent name="plus" width={20} height={20} className="w-6 h-6 ml-2" />
    </Button>
  )
}
