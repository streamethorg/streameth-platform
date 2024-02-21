import { CardTitle } from '@/components/ui/card'
import { fetchAllSessions } from '@/lib/data'
import Image from 'next/image'
import VideoGrid from '@/components/misc/Videos'
import Link from 'next/link'
import { archivePath } from '@/lib/utils/utils'
import { IExtendedOrganization } from '@/lib/types'
export default async function OrganizationStrip({
  organization,
}: {
  organization: IExtendedOrganization
}) {
  const videos = (
    await fetchAllSessions({
      organizationSlug: organization.slug,
      onlyVideos: true,
      limit: 8,
    })
  ).sessions

  if (videos.length === 0) return false
  return (
    <div key={organization.slug} className="flex flex-col">
      <div className="flex flex-row my-2">
        <Image
          className="rounded"
          alt="Session image"
          quality={80}
          src={organization.logo}
          height={34}
          width={34}
        />
        <Link href={archivePath({ organization: organization.slug })}>
          <CardTitle className=" text-2xl ml-2 mr-auto hover:underline">
            {organization.name} {' >'}
          </CardTitle>
        </Link>
      </div>
      <div className="flex flex-row overflow-y-auto gap-4 h-full">
        <VideoGrid scroll videos={videos} maxVideos={7} />
      </div>
    </div>
  )
}

export const OrganizationStripSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row my-2 items-center">
          <div className="rounded-full bg-gray-300 h-8 w-8"></div>
          <div className="h-6 bg-gray-300 rounded ml-2 mr-auto w-1/4"></div>
        </div>
        <div className="flex flex-row overflow-y-auto gap-4 h-full">
          <VideoGridSkeleton />
        </div>
      </div>
    </div>
  )
}

const VideoGridSkeleton = () => {
  const skeletonCards = Array(7).fill(0) // Assuming you want 7 placeholders

  return (
    <div className="max-w-screen lg:w-full bg-transparent border-none">
      <div className="flex flex-row gap-8 gap-x-4">
        {skeletonCards.map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

const VideoCardSkeleton = () => {
  return (
    <div className="w-[300px] lg:w-full h-full flex-initial space-y-2">
      <div className="h-44 bg-gray-300 rounded-xl"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="flex flex-row items-center space-x-2">
        <div className="h-6 w-6 bg-gray-300 rounded-md"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  )
}
