import { DataTableSkeleton } from '@/app/components'
import AddButtonAndModalCustomer from '@/app/dashboard/customer-management/components/AddButtonAndModalCustomer.component'
import TableCustomerManagement from '@/app/dashboard/customer-management/components/TableCustomerManagement.component'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getCustomers } from '@/modules/customer/application/actions/customer.action'
import { QUERY_KEYS_CUSTOMER_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

export default async function Page (props: {
  searchParams?: Promise<{
    pageIndex?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const pageIndex = Number(searchParams?.pageIndex) || 1
  const pageSize = Number(searchParams?.pageSize) || 10

  const queryClient = getQueryClient()
  queryClient.prefetchQuery({
    queryKey: [
      QUERY_KEYS_CUSTOMER_MANAGEMENT.LMListCustomers,
      pageIndex,
      pageSize
    ],
    queryFn: () => getCustomers({ pageIndex, pageSize })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-app-quaternary mb-2">
              Clientes
            </h1>
            <p className="text-app-primary">
              Ver, añadir, editar y eliminar información del cliente.
            </p>
          </div>
          <div className="flex space-x-2">
            {/* Botón para añadir clientes */}
            <AddButtonAndModalCustomer />
          </div>
        </div>

        {/* Tabla de clientes */}
        <Suspense
          key={pageIndex + pageSize}
          fallback={<DataTableSkeleton columnCount={6} />}
        >
          <TableCustomerManagement pageIndex={pageIndex} pageSize={pageSize} />
        </Suspense>
      </main>
    </HydrationBoundary>
  )
}
