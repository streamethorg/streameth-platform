import { studioPageParams } from '@/lib/types'
import SessionAccordion from './components/SessionAccordion'
import { fetchSession } from '@/lib/services/sessionService'
import { PlayerWithControls } from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { Livepeer } from 'livepeer'
import { notFound } from 'next/navigation'

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
  if (!session) {
    return notFound()
  }

  const video = (await livepeer.asset.get(session?.assetId as string))
    .asset

  if (!video) return notFound()

  return (
    <div className="p-4 h-full">
      <div className="flex flex-row space-x-4 h-full">
        <div className="w-full">
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
          <SessionInfoBox
            title={session.name}
            playerName={session.name}
            playbackId={session.playbackId}
            assetId={session.assetId}
            viewCount
          />{' '}
        </div>
        <div className="w-1/3 h-full overflow-auto relative">
          <SessionAccordion
            session={session}
            organizationSlug={params.organization}
          />
        </div>
      </div>
    </div>
  )
}

export default EditSession
