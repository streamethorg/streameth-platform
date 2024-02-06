import ScheduleCard from '@/app/[organization]/[event]/schedule/components/ScheduleCard'

import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'

import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaBody,
} from '@/components/ui/crezenda'

import Link from 'next/link'
import { IExtendedEvent, IExtendedSession } from '@/lib/types'

interface Params {
  event: IExtendedEvent
  speaker: ISpeakerModel
  sessions?: IExtendedSession[]
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
