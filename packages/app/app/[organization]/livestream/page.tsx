'use server'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { OrganizationPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchOrganization } from '@/lib/services/organizationService'
import { Suspense } from 'react'
import WatchGrid from '../components/WatchGrid'
import { fetchStage } from '@/lib/services/stageService'
import Player from './components/Player'

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
    <Suspense key={stage._id} fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl h-full">
        <Player stage={stage} />
        <div className=" w-full px-4 md:p-0">
          <SessionInfoBox
            name={stage.name}
            description={stage.description ?? ''}
            date={stage.streamDate as string}
            vod={true}
          />
        </div>
        <div className="px-4">
          <WatchGrid organizationSlug={params.organization} />
        </div>
      </div>
    </Suspense>
  )
}

export async function generateMetadata({
  searchParams,
}: OrganizationPageProps): Promise<Metadata> {
  const response = await fetch(
    `${apiUrl()}/sessions/${searchParams.session}`
  )
  const responseData = await response.json()
  const video = responseData.data

  if (!searchParams.session) return generalMetadata

  if (!video) return generalMetadata
  return watchMetadata({ session: video })
}
