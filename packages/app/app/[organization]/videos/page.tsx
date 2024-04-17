import { OrganizationPageProps, SearchPageProps } from '@/lib/types'
import {
  generalMetadata,
  archiveMetadata,
} from '@/lib/utils/metadata'
import { Metadata } from 'next'
import { fetchEvent } from '@/lib/services/eventService'
import { Suspense } from 'react'
import ArchiveVideos from '@/app/(vod)/components/ArchiveVideos'
import ArchiveVideoSkeleton from '@/app/(vod)/components/ArchiveVideosSkeleton'
import Image from 'next/image'
import { fetchOrganization } from '@/lib/services/organizationService'
import { notFound } from 'next/navigation'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'

export default async function ArchivePage({
  params,
  searchParams,
}: OrganizationPageProps) {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  return (
    <div>
      <div className='max-h-[200px] h-full aspect-video w-full'>
        {organization.banner ? (
          <Image
            src={organization.banner}
            alt="banner"
            quality={100}
            objectFit="cover"
            className="rounded-xl"
            fill
            priority
          />
        ) : (
          <div className=" bg-gray-300 rounded-xl md:rounded-none max-h-[200px] h-full">
            <StreamethLogoWhite />
          </div>
        )}
      </div>
      <div className="w-full max-w-5xl m-auto p-4">
        <Suspense fallback={<ArchiveVideoSkeleton />}>
          <ArchiveVideos
            organizationSlug={params.organization}
            searchQuery={searchParams.searchQuery || ''}
            page={Number(searchParams.page || 1)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  if (!searchParams.event) return generalMetadata
  const event = await fetchEvent({
    eventSlug: searchParams.event,
  })

  if (!event) return generalMetadata
  return archiveMetadata({ event })
}
