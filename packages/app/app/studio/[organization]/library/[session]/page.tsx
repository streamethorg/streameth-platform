'use server'

import { studioPageParams } from '@/lib/types'
import { fetchSession } from '@/lib/services/sessionService'
import { PlayerWithControls } from '@/components/ui/Player'
import { Livepeer } from 'livepeer'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EditSessionForm from './components/EditSessionForm'
import Link from 'next/link'
import SessionOptions from './components/SessionOptions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import GetHashButton from '../components/GetHashButton'
import TextPlaceholder from '@/components/ui/text-placeholder'

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
    <div className="p-4 h-full">
      <Link href={`/studio/${params.organization}/library`}>
        <div className="flex justify-start items-center mb-4 space-x-4">
          <ArrowLeft />
          <p>Back to library</p>
        </div>
      </Link>

      <div className="flex flex-row space-x-4">
        <div className="p-4 space-y-4 w-2/3 bg-white rounded-xl border">
          <h1 className="text-lg font-bold">Video Details</h1>
          <EditSessionForm
            session={session}
            organizationSlug={params.organization}
          />
        </div>
        <div className="flex flex-col space-y-4 w-1/3">
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
          <div className="flex flex-col p-4 space-y-4 bg-white rounded-xl border">
            <h1 className="text-lg font-bold">Publish video</h1>
            <div className="flex flex-row">
              <GetHashButton session={session} />
            </div>
          </div>
          <div className="flex flex-col p-4 space-y-4 bg-white rounded-xl border">
            <h1 className="text-lg font-bold">Video data</h1>
            {session.playbackId && (
              <div>
                <Label>Playback Id</Label>
                <TextPlaceholder text={session.playbackId} />
              </div>
            )}
            {session.assetId && (
              <div>
                <Label>Asset Id</Label>
                <TextPlaceholder text={session.assetId} />
              </div>
            )}
            {session.videoTranscription && (
              <div>
                <Label>Transcript</Label>
                <TextPlaceholder text={session.videoTranscription} />
              </div>
            )}
          </div>
          {/* <SessionOptions
            name={video.name}
            sessionId={params.session}
            organizationSlug={params.organization}
            playbackId={video.playbackId!}
            assetId={session.assetId}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default EditSession
