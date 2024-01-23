import Image from 'next/image'
import Link from 'next/link'
import VideoGrid from '@/components/misc/Videos'
import { CardTitle } from '@/components/ui/card'

import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { fetchAllSessions } from '@/lib/data'

export default async function OrganizationStrip({
  organization,
}: {
  organization: IOrganization
}) {
  const videos = (
    await fetchAllSessions({
      organizationSlug: organization.slug,
      onlyVideos: true,
      limit: 4,
    })
  ).sessions

  if (videos.length === 0) return false
  return (
    <div key={organization.slug} className="bg-white flex flex-col">
      <div className="flex flex-row my-2">
        <Image
          className="rounded"
          alt="Session image"
          quality={80}
          src={organization.logo}
          height={34}
          width={34}
        />

        <Link href={'/archive?organization=' + organization?.slug}>
          <CardTitle className="text-background text-2xl ml-2 mr-auto hover:underline">
            {organization.name} {' >'}
          </CardTitle>
        </Link>
      </div>
      <div className="flex flex-row overflow-y-scroll gap-4 h-full">
        <VideoGrid scroll videos={videos} maxVideos={3} />
      </div>
    </div>
  )
}

{
}
