/* eslint-disable @next/next/no-img-element */
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { KEY_ROLES } from '@/modules/auth/constants/auth.constants'
import { useModalUser } from '@/modules/share/infra/store/ui.store'
import Link from 'next/link'

export interface ModalUserProps {
    email: string;
    nameUser: string;
    role: string;
    img: string;
}

export function ModalUser (params: ModalUserProps) {
  const { isModalUserOpen, toggleModalUser } = useModalUser()
  return (
        <Dialog open={isModalUserOpen} onOpenChange={toggleModalUser} >
            <DialogContent className="sm:max-w-[425px]" aria-describedby='Información del usuario'>
                <DialogHeader >
                    <DialogTitle>Información del Usuario</DialogTitle>
                    <DialogDescription>
                        Aquí puedes ver la información básica del usuario.
                    </DialogDescription>
                    <div className='w-full flex justify-center py-5'>

                        <Avatar className='h-20 w-20'>
                            <AvatarImage src={params.img} alt={params.nameUser} />
                            <AvatarFallback>{params.nameUser.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>

                </DialogHeader>

                <div className="text-center">
                    <h2 className="text-lg font-medium">{params.email}</h2>

                    <div className="mt-4">
                        <div className="text-left">
                            <p className="text-base font-bold text-app-primary">Nombre</p>
                            <p className="text-base font-medium text-gray-500">{params.nameUser}</p>
                        </div>

                        <div className="text-left mt-2">
                            <p className="text-base font-bold text-app-primary">Rol del Usuario</p>
                            <p className="text-base font-medium text-gray-500">{params.role}</p>
                        </div>
                    </div>

                    {
                        params.role === Symbol.keyFor(KEY_ROLES.Admin) && (
                            <div className="mt-6">
                                <Link href="/dashboard/user-management"
                                    className="bg-app-secondary text-white px-4 py-2 rounded-lg hover:bg-red-500"
                                >
                                    Gestionar Usuario
                                </Link>
                            </div>
                        )
                    }
                </div>

            </DialogContent>
        </Dialog>
  )
}
