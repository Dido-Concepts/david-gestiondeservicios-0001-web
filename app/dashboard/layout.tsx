import {
  NavbarHeaderContainer,
  SidebarBackdrop,
  SidebarContainer,
  SidebarFooter,
  SidebarLinks
} from '@/app/dashboard/components'
import { auth } from '@/config/auth'
import { ReactNode } from 'react'
import { ModalUser, ModalUserProps } from '@/app/dashboard/components/ModalUser.component'

export default async function DashboardLayout ({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth()

  const userInfoModal: ModalUserProps = {
    email: session?.user.email ?? '',
    role: session?.user.role ?? '',
    img: session?.user.image ?? '',
    nameUser: session?.user.name ?? ''
  }

  return (
    <div className={'flex h-screen overflow-y-hidden bg-app-terciary'}>

      <SidebarBackdrop />

      <SidebarContainer >

        <SidebarLinks />
        <SidebarFooter />

      </SidebarContainer>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <NavbarHeaderContainer userName={session?.user.email ?? ''} />

        <div className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
          {children}
          <div className="flex flex-col items-start justify-between pb-6 space-y-4 border-b lg:items-center lg:space-y-0 lg:flex-row"></div>
        </div>

      </div>

      <ModalUser {...userInfoModal} />

    </div>
  )
}
