'use client'

import { IconComponent } from '@/app/components'
import { useModalUserForm } from '@/modules/user/infra/store/user-management.store'

export function AddButtonLocation () {
  const { toggleModal, setUser } = useModalUserForm()
  const handleCreateUser = () => {
    setUser(null)
    toggleModal()
  }
  return (
        <button
            className="mt-4 md:mt-0 bg-app-quaternary hover:bg-gray-500 text-app-terciary px-4 py-2 rounded-lg flex items-center"
            onClick={handleCreateUser}
        >
            Añadir sede
            <IconComponent name="plus" width={20} height={20} className="w-6 h-6 ml-2" />
        </button>
  )
}
//
