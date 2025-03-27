import { DataTableSkeleton } from '@/app/components'
import { getQueryClient } from '@/app/providers/GetQueryClient'
import { getLocationById } from '@/modules/location/application/actions/location.action'
import { QUERY_KEYS_LOCATION_MANAGEMENT } from '@/modules/share/infra/constants/query-keys.constant'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { WrapperLocationManagementId } from './components/WrapperLocationManagementId.component'

export default async function EditLocationPage ({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const queryClient = getQueryClient()

  try {
    const location = await getLocationById(id)

    queryClient.setQueryData([QUERY_KEYS_LOCATION_MANAGEMENT.LMGetLocation, id], location)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      redirect('/dashboard/location-management?error=not_found')
    }
    throw error
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense key={id} fallback={<DataTableSkeleton columnCount={6} />}>
        <WrapperLocationManagementId id={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
