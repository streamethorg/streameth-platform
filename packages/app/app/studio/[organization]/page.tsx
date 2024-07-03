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

  const stages = await fetchOrganizationStages({
    organizationId: organization._id,
  })

  const sortedStages = sortArray(
    stages,
    searchParams.sort
  ) as unknown as IExtendedStage[]

  return (
    <div className="h-full w-full p-8 flex flex-col">
      <div className="flex flex-col max-h-[200px] w-full">
        <h2 className="text-lg font-bold">Create</h2>
        <div className="flex items-center md gap-4 max-w-5xl py-4">
          <CreateLivestreamModal
            show={searchParams?.show}
            organization={organization}
          />
          <Link href={`/studio/${params.organization}/library`}>
            <div className="flex flex-row bg-white p-2 rounded-xl  border space-x-4 items-center">
              <div className="p-4 border bg-primary  rounded-xl text-white">
                <LuFileUp className="h-6" />
              </div>
              <span className=" ">Upload Video</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col h-[80%]">
        <p className="py-4 font-bold text-lg">Livestreams</p>
        <Suspense
          key={searchParams.toString()}
          fallback={<Loading />}>
          <LivestreamTable
            organizationSlug={params?.organization}
            streams={sortedStages}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default OrganizationPage
