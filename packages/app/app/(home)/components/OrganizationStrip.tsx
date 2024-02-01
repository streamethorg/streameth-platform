import { CardTitle } from '@/components/ui/card'
import { fetchAllSessions } from '@/lib/data'
import Image from 'next/image'
import VideoGrid from '@/components/misc/Videos'
import Link from 'next/link'
import { archivePath } from '@/lib/utils/utils'
import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'
export default async function OrganizationStrip({
  organization,
}: {
  organization: IOrganizationModel
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
      <div className="flex flex-row overflow-y-scroll gap-4 h-full">
        <VideoGrid scroll videos={videos} maxVideos={7} />
      </div>
    </div>
  )
}

{
}
