'use server'

import { CameraIcon } from 'lucide-react'
import Link from 'next/link'
import { Livestreams, Loading } from './livestreams/page'
import {
  IExtendedSession,
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
import LibraryListLayout from './library/components/LibraryListLayout'
import { fetchAllSessions } from '@/lib/data'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
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

  const sessions = (
    await fetchAllSessions({
      organizationSlug: params.organization,
    })
  ).sessions.filter((session) => session.videoUrl)

  const sortedSessions = sortArray(sessions, searchParams.sort)

  return (
    <div className="h-full w-full p-8 flex flex-col">
      <div className='flex flex-col max-h-[200px] w-full'>
        <h2 className="text-lg font-bold">Create</h2>
        <div className="flex items-center md gap-4 max-w-5xl py-4">
          <CreateLivestreamModal
            show={searchParams?.show}
            organization={organization}
          />
          <Link href={`/studio/${params.organization}/library`}>
            <div className="flex flex-row bg-white p-2 rounded-xl  border space-x-4 items-center">
              <div className="p-4 border bg-primary  rounded-xl text-white">
                <CameraIcon className="h-6" />
              </div>
              <span className=" ">Upload Video</span>
            </div>
          </Link>
        </div>
      </div>
      <div className='flex flex-col h-[80%]'>
        <p className="py-4 font-bold text-lg">Livestreams</p>
        <Suspense
          key={searchParams.toString()}
          fallback={<Loading />}>
          <LivestreamTable
            organizationSlug={params?.organization}
            streams={stages as IExtendedStage[]}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default OrganizationPage
