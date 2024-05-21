'use server'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { IExtendedSession, OrganizationPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import {
  generalMetadata,
  livestreamMetadata,
} from '@/lib/utils/metadata'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Suspense } from 'react'
import WatchGrid from '../components/WatchGrid'
import { fetchStage } from '@/lib/services/stageService'
import Player from './components/Player'

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full animate-pulse">
      <div className="flex flex-col w-full h-full md:p-4">
        <div className="w-full bg-gray-300 aspect-video"></div>
        <div className="px-4 mt-4 space-y-2 w-full md:px-0">
          <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
          <div className="w-full h-32 bg-gray-300 rounded md:h-60"></div>
        </div>
      </div>
    </div>
  )
}

export default async function Livestream({
  params,
  searchParams,
}: OrganizationPageProps) {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  if (!searchParams.stage) return notFound()

  const stage = await fetchStage({
    stage: searchParams.stage,
  })

  if (!stage?._id || !stage.streamSettings?.streamId)
    return notFound()

  return (
    <Suspense key={stage._id} fallback={<Loading />}>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full md:px-4 md:mt-4">
        <Player stage={stage} />
        <div className="px-4 w-full md:p-0">
          <SessionInfoBox
            name={stage.name}
            description={stage.description ?? ''}
            date={stage.streamDate as string}
            video={stage as IExtendedSession}
          />
        </div>
        <div className="px-4 md:px-0">
          <div className="md:hidden">
            <WatchGrid organizationSlug={params.organization} />
          </div>
          <div className="hidden md:block">
            <WatchGrid
              organizationSlug={params.organization}
              gridLength={6}
            />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: OrganizationPageProps): Promise<Metadata> {
  if (!searchParams.stage) return generalMetadata
  const stage = await fetchStage({
    stage: searchParams.stage,
  })

  const organization = await fetchOrganization({
    organizationSlug: params?.organization,
  })

  if (!stage || !organization) return generalMetadata

  return livestreamMetadata({
    livestream: stage,
    organization,
  })
}
