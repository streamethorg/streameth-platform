import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { fetchOrganization } from '@/lib/services/organizationService'
import { ChannelPageParams } from '@/lib/types'
import ChannelShareIcons from './components/ChannelShareIcons'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import StreamethLogoWhite from '@/lib/svg/StreamethLogoWhite'
import WatchGrid, { WatchGrdiLoading } from './components/WatchGrid'
import UpcomingStreams, {
  UpcomingStreamsLoading,
} from './components/UpcomingStreams'


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

  return (
    <div className="w-full max-w-5xl m-auto">
      <div className="z-10 md:p-4 relative w-full">
        <AspectRatio ratio={3 / 1} className="w-full rounded-xl relative">
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
            <div className="h-full bg-gray-300 rounded-xl">
              <StreamethLogoWhite />
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="w-full absolute right-0 bottom-0 left-0 p-4 space-y-2 text-white">
            <div className="flex flex-row justify-between w-full">
              <div>
                <h2 className="text-2xl font-bold">
                  {organization.name}
                </h2>
                <p className="text-lg">{organization.description}</p>
              </div>
              <ChannelShareIcons organization={organization} />
            </div>
          </div>
        </AspectRatio>
      </div>
      <Card className="p-4 space-y-6 bg-white shadow-none border-none w-full">
        <Suspense fallback={<UpcomingStreamsLoading />}>
          <UpcomingStreams organizationId={organization._id} />
        </Suspense>
        <Suspense fallback={<WatchGrdiLoading />}>
          <WatchGrid organizationSlug={params.organization} />
        </Suspense>
      </Card>
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

export default OrganizationHome
