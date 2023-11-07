import Session from '@/server/model/session'
import Player from '@/components/misc/Player'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import ComponentCard from '@/components/misc/ComponentCard'
import SpeakerIconList from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerIconList'
import ActionsComponent from './ActionsComponent'
import EmbedButton from '@/components/misc/EmbedButton'
import Card from '@/components/misc/Card'
import Image from 'next/image'
import Link from 'next/link'

const SpeakerComponent = ({ session }: { session: Session }) => {
  return (
    <ComponentCard>
      <SpeakerIconList speakers={session.speakers} />
    </ComponentCard>
  )
}
export default async function SessionComponent({
  session,
  nextSession,
  params,
}: {
  session: Session
  nextSession: Session | null
  params: string
}) {
  return (
    <div className="flex flex-col w-full max-h-full h-full lg:flex-row relative overflow-y-scroll md:p-4 gap-4">
      <div className="w-full h-full lg:w-[70%]">
        <div className="sticky top-0 md:relative flex flex-col rounded-b-xl  box-border lg:overflow-scroll">
          <ActionsComponent goBackButton>
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
        {nextSession?.videoUrl && (
          <div className="mt-10 lg:w-[60%]">
            <p className="font-medium text-xl bg-base text-white p-2 rounded-xl mb-4">
              Next Talk
            </p>
            <Card>
              <Link
                href={
                  `/${params}/${nextSession?.eventId}/session/` +
                  nextSession?.id
                }>
                <div className="aspect-video cursor-pointer relative  w-full">
                  <Image
                    className="rounded-xl"
                    alt="Session image"
                    quality={60}
                    src={
                      nextSession.coverImage
                        ? nextSession?.coverImage
                        : ''
                    }
                    fill
                    // sizes="20vw"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <p className=" p-2 py-4 text-md">
                  {nextSession?.name}
                </p>
              </Link>
            </Card>
          </div>
        )}
      </div>
      <div className="flex space-y-4 flex-col w-full p-2 lg:w-[30%] lg:overflow-y-scroll lg:p-0">
        <SessionInfoBox session={session.toJson()} showDate />
        <SpeakerComponent session={session} />
      </div>
    </div>
  )
}
