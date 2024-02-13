import { studioPageParams } from '@/lib/types'
import SessionAccordion from './components/SessionAccordion'
import { fetchSession } from '@/lib/data'
import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
const EditSession = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const session = await fetchSession({
    session: params.session,
  })

  if (!session)
    return (
      <div>
        <h1>No session found</h1>
      </div>
    )

  return (
    <div className="p-4 h-full">
      <div className="flex flex-row space-x-4 h-full">
        <div className="w-full">
          <Player assetId={session.assetId} />
          <SessionInfoBox
            title={session.name}
            playerName={session.name}
            playbackId={session.playbackId}
            assetId={session.assetId}
            viewCount
          />{' '}
        </div>
        <div className="w-1/3 h-full overflow-auto relative">
          <SessionAccordion session={session} />
        </div>
      </div>
    </div>
  )
}

export default EditSession
