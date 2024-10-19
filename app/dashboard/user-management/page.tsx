import { DataTableSkeleton } from '@/app/components'
import { AddButtonUser, ModalUserFormData, TableUserManagement } from '@/app/dashboard/user-management/components'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { getListUsers } from '@/modules/user/infra/actions/user.action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

export default function UserManagementPage () {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers],
    queryFn: getListUsers
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-app-secondary mb-2">Gestionar equipo</h1>
            <p className="text-app-primary text-2xl">Añada, edite o elimine miembros del equipo</p>
          </div>

          <AddButtonUser />
        </div>

        <div className="container mx-auto py-10">
          <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
            <TableUserManagement />
          </Suspense>
        </div>
      </main>

      <ModalUserFormData />
    </HydrationBoundary>

  )
}
