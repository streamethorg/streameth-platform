import ScheduleCard from '@/app/[organization]/[event]/schedule/components/ScheduleCard'

import { ISpeaker } from 'streameth-server/model/speaker'
import { ISession } from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'

import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaBody,
} from '@/components/ui/crezenda'

import Link from 'next/link'

interface Params {
  event: IEvent
  speaker: ISpeaker
  sessions?: ISession[]
}

const SpeakerModal = ({ event, sessions, speaker }: Params) => {
  return (
    <CredenzaContent className="max-h-[70vh]">
      <CredenzaHeader>
        <CredenzaTitle>{speaker.name}</CredenzaTitle>
        <CredenzaDescription>
          {speaker.twitter && (
            <Link href={`https://x.com/${speaker.twitter}`}>
              Follow on X
            </Link>
          )}
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        {speaker.bio}
        {sessions && (
          <div className="flex flex-col text-lg bg-base p-4 rounded-xl space-y-4">
            <p className="font-bold text-lg">Sessions</p>
            {sessions?.map((session, index) => (
              <ScheduleCard
                key={session?.id}
                event={event}
                session={session}
                showTime
              />
            ))}
          </div>
        )}
      </CredenzaBody>
    </CredenzaContent>
  )
}

export default SpeakerModal
