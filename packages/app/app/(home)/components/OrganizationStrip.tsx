import Image from 'next/image'
import Link from 'next/link'
import VideoGrid from '@/components/misc/Videos'
import { CardTitle } from '@/components/ui/card'

import { IOrganization } from 'streameth-server/model/organization'
import { fetchAllSessions } from '@/lib/data'

export default async function OrganizationStrip({
  organization,
}: {
  organization: IOrganization
}) {
  // const videos = (
  //   await fetchAllSessions({
  //     organization: organization.id,
  //     onlyVideos: true,
  //     limit: 4,
  //   })
  // ).sessions
  // const response = await fetch(
  //   `${apiUrl()}/sessions?organization=${organization?.slug}&onlyVideos=true&page=1&size=4`
  // )
  // const data = await response.json()
  // const videos = data.data.sessions ?? []

  if (videos.length === 0) return false
  return (
    <div key={organization._id} className="bg-white flex flex-col">
      <div className="flex flex-row my-2">
        <Image
          className="rounded"
          alt="Session image"
          quality={80}
          src={organization.logo}
          height={34}
          width={34}
        />

        <Link href={'/archive?organization=' + organization?._id}>
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
