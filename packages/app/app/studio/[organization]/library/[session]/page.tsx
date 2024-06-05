import { studioPageParams } from '@/lib/types'
import { fetchSession } from '@/lib/services/sessionService'
import { PlayerWithControls } from '@/components/ui/Player'
import { Livepeer } from 'livepeer'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EditSessionForm from './components/EditSessionForm'
import Link from 'next/link'
import SessionOptions from './components/SessionOptions'

const EditSession = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const session = await fetchSession({
    session: params.session,
  })

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  if (!session || !session.assetId) {
    return notFound()
  }

  const video = (await livepeer.asset.get(session.assetId)).asset

  if (!video) return notFound()

  return (
    <div className="p-2 h-full">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center my-4 mx-6 space-x-4">
          <ArrowLeft />
          <p>Back to library</p>
        </div>
      </Link>

      <div className="flex flex-row space-x-4">
        <div className="px-6 space-y-4 w-2/3">
          <h3 className="text-5xl font-bold">Video Details</h3>
          <EditSessionForm
            session={session}
            organizationSlug={params.organization}
          />
        </div>
        <div className="w-1/3">
          <PlayerWithControls
            src={[
              {
                src: video.playbackUrl as `${string}m3u8`,
                width: 1920,
                height: 1080,
                mime: 'application/vnd.apple.mpegurl',
                type: 'hls',
              },
            ]}
          />
          <SessionOptions
            name={video.name}
            sessionId={params.session}
            organizationSlug={params.organization}
            playbackId={video.playbackId!}
            assetId={session.assetId}
          />
        </div>
      </div>
    </div>
  )
}

export default EditSession
