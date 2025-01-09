import { DataTableSkeleton } from '@/app/components'
import { AddButtonUser, InputSearch, ModalUserFormData, TableUserManagement } from '@/app/dashboard/user-management/components'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { QUERY_KEYS_USER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { getListUsers } from '@/modules/user/infra/actions/user.action'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

export default async function UserManagementPage (props: {
  searchParams?: Promise<{
    query?: string;
    pageIndex?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const pageIndex = Number(searchParams?.pageIndex) || 1
  const pageSize = Number(searchParams?.pageSize) || 10

  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS_USER_MANAGEMENT.UMListUsers, query, pageIndex, pageSize],
    queryFn: () => getListUsers({ pageIndex, pageSize, query })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">Gestionar equipo</h1>
            <p className="text-app-primary ">Añada, edite o elimine miembros del equipo</p>
          </div>

          <AddButtonUser />
        </div>

        <div className="container mx-auto py-10 flex flex-col gap-8">
          <InputSearch />
          <Suspense key={query + pageIndex + pageSize} fallback={<DataTableSkeleton columnCount={6} />}>
            <TableUserManagement pageIndex={pageIndex} pageSize={pageSize} query={query} />
          </Suspense>
        </div>
      </main>

      <ModalUserFormData />
    </HydrationBoundary>

  )
}
//
