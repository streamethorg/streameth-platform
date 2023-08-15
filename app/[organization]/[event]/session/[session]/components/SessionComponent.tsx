import Session from '@/server/model/session'
import Player from '@/components/misc/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import ComponetCard from '@/components/misc/ComponentCard'
import SpeakerIconList from '@/components/speakers/SpeakerIconList'
import ActionsComponent from './ActionsComponent'

const SpeakerComponent = ({ session }: { session: Session }) => {
  return (
    <ComponetCard title="Speakers">
      <SpeakerIconList speakers={session.speakers} />
    </ComponetCard>
  )
}
export default async function SessionComponent({ session }: { session: Session }) {
  return (
    <div className="flex flex-col w-full max-h-full h-full lg:flex-row relative overflow-y-scrol md:p-4 gap-4">
      <div className="flex flex-col w-full h-full lg:w-[70%] box-border relative gap-4 lg:overflow-scroll">
        <div className="sticky top-0 md:relative">
          <ActionsComponent session={session} />
          <Player playbackId={session.playbackId} playerName={session.name} coverImage={session.coverImage} />
        </div>
        <div className="px-2 md:p-0">
          <SessionInfoBox session={session.toJson()} />
        </div>
      </div>
      <div className="flex flex-col w-full p-2 lg:w-[30%] lg:overflow-y-scroll lg:p-0">
        <SpeakerComponent session={session} />
        <div className="rounded border-2 cursor-pointer border-accent font-bold uppercase text-center p-4 mt-4 shadow hover:bg-accent  bg-accent text-white hover:animate-pulse">
          Collect this talk
        </div>
      </div>
    </div>
  )
}
