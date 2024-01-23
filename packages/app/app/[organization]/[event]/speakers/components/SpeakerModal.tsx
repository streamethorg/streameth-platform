import ScheduleCard from '@/app/[organization]/[event]/schedule/components/ScheduleCard'

import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
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

interface Params {
  event: IEventModel
  speaker: ISpeakerModel
  sessions?: ISessionModel[]
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
