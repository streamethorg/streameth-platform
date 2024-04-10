import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchOrganization } from '@/lib/services/organizationService'
import Channel from './components/Channel'
import { ChannelPageParams } from '@/lib/types'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'
import { fetchSession } from '@/lib/services/sessionService'

import ChannelPlayer from './components/ChannelPlayer'
import {
  fetchOrganizationStages,
  fetchStage,
} from '@/lib/services/stageService'
import { fetchAllSessions } from '@/lib/data'

const pages = [
  {
    name: 'Videography',
    href: 'https://info.streameth.org/stream-eth-studio',
    bgColor: 'bg-muted ',
  },
  {
    name: 'Product',
    href: 'https://info.streameth.org/services',
    bgColor: 'bg-muted ',
  },
  {
    name: 'Host your event',
    href: 'https://info.streameth.org/contact-us',
    bgColor: 'bg-primary text-primary-foreground',
  },
]

export default async function OrganizationHome({
  params,
  searchParams,
}: ChannelPageParams) {
  if (!params.organization) {
    return notFound()
  }
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })
  if (!organization) {
    return notFound()
  }

  const libraryVideo = await fetchSession({
    session: searchParams.id,
  })

  const playbackLivestream = await fetchStage({
    stage: searchParams.streamId,
  })

  const searchVideos = (
    await fetchAllSessions({
      organizationSlug: params.organization,
      onlyVideos: true,
      searchQuery: searchParams.search,
      limit: 50,
      page: 1,
    })
  ).sessions

  const allStreams = await fetchOrganizationStages({
    organizationId: organization._id,
  })
  const activeStream = allStreams?.filter(
    (stream) => stream?.streamSettings?.isActive
  )

  const playerActive =
    !!libraryVideo || !!playbackLivestream || !!activeStream[0]

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      <HomePageNavbar pages={pages} />
      {playerActive && (
        <ChannelPlayer
          libraryVideo={libraryVideo}
          organization={organization}
          activeStream={playbackLivestream ?? activeStream[0]}
        />
      )}
      <div className="flex flex-col overflow-auto p-0 lg:p-4">
        <Channel
          tab={searchParams.tab}
          playerActive={playerActive}
          organizationSlug={params.organization}
          searchVideos={searchVideos}
          searchQuery={searchParams.search}
        />
      </div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: ChannelPageParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const organizationInfo = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organizationInfo) {
    return {
      title: 'Organization not found',
      description: 'Organization not found',
    }
  }

  const imageUrl = organizationInfo.logo
  try {
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
      openGraph: {
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: organizationInfo.name,
      description: organizationInfo.description,
    }
  }
}
