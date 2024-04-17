import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchOrganization } from '@/lib/services/organizationService'
import Channel from './components/Channel'
import { ChannelPageParams } from '@/lib/types'
import { fetchSession } from '@/lib/services/sessionService'
import ChannelShareIcons from './components/ChannelShareIcons'
import {
  fetchOrganizationStages,
  fetchStage,
} from '@/lib/services/stageService'
import Image from 'next/image'
import { fetchAllSessions } from '@/lib/data'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import VideoCardSkeleton, {
  VideoCardSkeletonMobile,
} from '@/components/misc/VideoCard/VideoCardSkeleton'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'

const Loading = () => {
  return (
    <Card className="p-4 mt-40 space-y-6 bg-white shadow-none animate-pulse md:mt-4">
      <div className="w-1/4 h-6 bg-gray-300 rounded md:hidden"></div>
      <div className="grid grid-rows-3 gap-4 m-5 md:hidden md:grid-cols-3 md:m-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="block md:hidden">
            <VideoCardSkeletonMobile />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
        <div className="w-1/5 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 m-5 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    </Card>
  )
}

const OrganizationHome = async ({
  params,
  searchParams,
}: ChannelPageParams) => {
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
    <>
      <div className="z-10 my-5">
        <AspectRatio ratio={4 / 1} className="w-full h-[256px]">
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
            <div className="h-full bg-gray-300">
              <StreamethLogoWhite />
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-4 space-y-2 text-white">
            <h2 className="text-2xl font-bold">
              {organization.name}
            </h2>
            <p className="text-lg">{organization.description}</p>
            <ChannelShareIcons organization={organization} />
          </div>
        </AspectRatio>
      </div>

      <Suspense fallback={<Loading />}>
        <Channel
          tab={searchParams.tab}
          playerActive={playerActive}
          organizationSlug={params.organization}
          searchVideos={searchVideos}
          searchQuery={searchParams.search}
        />
      </Suspense>
    </>
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

export default OrganizationHome
