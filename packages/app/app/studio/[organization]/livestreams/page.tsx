'use server'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React, { Suspense } from 'react'
import CreateLivestreamModal from './components/CreateLivestreamModal'
import { fetchOrganization } from '@/lib/services/organizationService'
import {
  IExtendedStage,
  LivestreamPageParams,
  eSort,
} from '@/lib/types'
import { fetchOrganizationStages } from '@/lib/services/stageService'
import LivestreamTable from './components/LivestreamTable'
import { sortArray } from '@/lib/utils/utils'
import EmptyFolder from '@/lib/svg/EmptyFolder'
import TableSkeleton from '@/components/misc/Table/TableSkeleton'

const Loading = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <TableSkeleton />
    </div>
  )
}

export const Livestreams = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null

  const stages = sortArray(
    await fetchOrganizationStages({
      organizationId: organization._id,
    }),
    searchParams.sort
  )

  return (
    <div className="flex flex-col bg-white rounded-xl border min-h-[300px]">
      {stages.length > 0 ? (
        <LivestreamTable
          organization={organization}
          organizationSlug={params?.organization}
          streams={stages as IExtendedStage[]}
        />
      ) : (
        <div>
          <div className="flex justify-end h-10 bg-white border-y border-muted"></div>
          <div className="flex flex-col gap-4 justify-center items-center m-auto h-96 bg-white">
            <EmptyFolder />
            <CardTitle className="text-2xl font-semibold">
              The livestream is empty
            </CardTitle>
            <CardDescription>
              Create your first livestream to get started!
            </CardDescription>
            <div className="mt-2 w-fit">
              <CreateLivestreamModal organization={organization} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const LivestreamsPage = ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  return (
    <Suspense key={searchParams.toString()} fallback={<Loading />}>
      <Livestreams params={params} searchParams={searchParams} />
    </Suspense>
  )
}

export default LivestreamsPage
