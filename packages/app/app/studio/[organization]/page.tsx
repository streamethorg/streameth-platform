'use server'

import { LuFileUp } from 'react-icons/lu'
import Link from 'next/link'
import { Loading } from './livestreams/page'
import {
  IExtendedStage,
  LivestreamPageParams,
  eSort,
} from '@/lib/types'
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal'
import { Suspense } from 'react'
import { fetchOrganization } from '@/lib/services/organizationService'
import LivestreamTable from './livestreams/components/LivestreamTable'
import { notFound } from 'next/navigation'
import { sortArray } from '@/lib/utils/utils'
import { fetchOrganizationStages } from '@/lib/services/stageService'

const OrganizationPage = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return notFound()

  const stages = sortArray(
    await fetchOrganizationStages({
      organizationId: organization._id,
    }),
    eSort.desc_date
  )

  return (
    <div className="overflow-auto p-12 w-full h-full">
      <h2 className="text-lg font-bold">Create</h2>
      <div className="flex gap-4 items-center py-4 max-w-5xl md">
        <CreateLivestreamModal
          show={searchParams?.show}
          organization={organization}
        />
        <Link href={`/studio/${params.organization}/library`}>
          <div className="flex flex-row items-center p-2 pr-4 space-x-4 bg-white rounded-xl border transition-colors hover:bg-accent">
            <div className="p-4 text-white rounded-xl border bg-primary">
              <LuFileUp size={25} />
            </div>
            <span>Upload video</span>
          </div>
        </Link>
      </div>
      <p className="p-4 text-lg font-bold">Livestreams</p>
      <Suspense key={searchParams.toString()} fallback={<Loading />}>
        <LivestreamTable
          organizationSlug={params?.organization}
          streams={stages as IExtendedStage[]}
        />
      </Suspense>
    </div>
  )
}

export default OrganizationPage
