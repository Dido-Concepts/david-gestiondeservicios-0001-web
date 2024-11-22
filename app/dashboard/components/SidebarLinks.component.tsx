import { LinkSidebar, LinkSidebarProps } from '@/app/dashboard/components/LinkSidebar.component'
import { auth } from '@/config/auth'
import { KEY_ROLES } from '@/modules/auth/constants/auth.constants'

const LINKS: LinkSidebarProps[] = [
  { href: '/dashboard', icon: 'house', text: 'Inicio', isAdmin: false },
  { href: '/dashboard/user-management', icon: 'group', text: 'Equipo', isAdmin: true },
  { href: '/dashboard/location-management', icon: 'store', text: 'Sedes', isAdmin: false },
  { href: '/dashboard/service-management', icon: 'scissors', text: 'Servicios', isAdmin: false }
]

export async function SidebarLinks () {
  const session = await auth()

  return (
        <nav className="flex-1 overflow-hidden  hover:overflow-y-auto bg-app-primary">
            <ul className="p-2 overflow-hidden">
                {
                    LINKS.map((link, index) => {
                      if (link.isAdmin && session?.user?.role !== Symbol.keyFor(KEY_ROLES.Admin)) return null
                      return (
                            <li key={index}>
                                <LinkSidebar {...link} />
                            </li>
                      )
                    })
                }
            </ul>
        </nav>
  )
}
