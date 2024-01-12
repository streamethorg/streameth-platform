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

const SpeakerModal = ({ speaker }: Params) => {
  return (
    <CredenzaContent>
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
      <CredenzaBody className="p-4">{speaker.bio}</CredenzaBody>
    </CredenzaContent>
  )
}

export default SpeakerModal
