import Session from '@/server/model/session'
import Player from '@/components/misc/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import ComponetCard from '@/components/misc/ComponentCard'
import SpeakerIconList from '@/components/speakers/SpeakerIconList'
import ActionsComponent from './ActionsComponent'
import EmbedButton from '@/components/misc/EmbedButton'

const SpeakerComponent = ({ session }: { session: Session }) => {
  return (
    <ComponetCard>
      <SpeakerIconList speakers={session.speakers} />
    </ComponetCard>
  )
}
export default async function SessionComponent({ session }: { session: Session }) {
  return (
    <div className="flex flex-col w-full max-h-full h-full lg:flex-row relative overflow-y-scrol md:p-4 gap-4">
      <div className="flex flex-col w-full h-full lg:w-[70%] box-border relative gap-4 lg:overflow-scroll">
        <div className="sticky top-0 md:relative">
          <ActionsComponent goBackButton>
            <EmbedButton playbackId={session.playbackId} playerName={session.name} />
          </ActionsComponent>
          <Player playbackId={session.playbackId} playerName={session.name} coverImage={session.coverImage} />
        </div>
      </div>
      <div className="flex space-y-4 flex-col w-full p-2 lg:w-[30%] lg:overflow-y-scroll lg:p-0">
        <SessionInfoBox session={session.toJson()} showDate />

        <SpeakerComponent session={session} />
      </div>
    </div>
  )
}
