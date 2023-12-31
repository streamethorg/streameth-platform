import Player from '@/components/ui/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import ComponentCard from '@/components/misc/ComponentCard'
import ActionsComponent from './ActionsComponent'
import EmbedButton from '@/components/misc/EmbedButton'
import Card from '@/components/misc/Card'
import Image from 'next/image'
import Link from 'next/link'
import Session from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'
import { getImageUrl } from '@/lib/utils'

const SpeakerComponent = ({
  event,
  session,
}: {
  event: IEvent
  session: Session
}) => {
  return (
    <ComponentCard>
      {/* <SpeakerIconList event={event} speakers={session.speakers} /> */}
    </ComponentCard>
  )
}
export default async function SessionComponent({
  session,
  nextSession,
  params,
  event,
}: {
  session: Session
  nextSession?: Session | null
  params: string
  event: IEvent
}) {
  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-5rem)] h-full lg:flex-row relative overflow-hidden md:p-4 md:gap-4">
      <div className="bg-black mb-2 lg:mb-0  p-2 md:p-4 md:rounded-xl sticky z-40 flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[75%]">
        <ActionsComponent
          session={session.toJson()}
          event={event}
          goBackButton>
          <EmbedButton
            playbackId={session.playbackId}
            playerName={session.name}
          />
        </ActionsComponent>
        <Player
          playbackId={session.playbackId}
          playerName={session.name}
          coverImage={session.coverImage}
        />
      </div>
      <div className="flex space-y-4 flex-col w-full p-2 lg:w-[30%]  overflow-y-scroll lg:p-0">
        <SessionInfoBox session={session.toJson()} showDate />
        <SpeakerComponent event={event} session={session} />
        {nextSession?.videoUrl && (
          <div className=" bg-base text-white p-2 rounded-xl mb-4">
            <p className="font-medium text-xl  ">Next Talk</p>
            <Link
              href={
                `/${params}/${nextSession?.eventId}/session/` +
                nextSession?.id
              }>
              <div className="aspect-video cursor-pointer relative  w-full">
                <Image
                  className="rounded-xl"
                  alt={nextSession?.name ?? 'Next Talk'}
                  quality={60}
                  src={
                    nextSession.coverImage
                      ? getImageUrl(nextSession.coverImage)
                      : ''
                  }
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <p className=" p-2 py-4 text-md">{nextSession?.name}</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
