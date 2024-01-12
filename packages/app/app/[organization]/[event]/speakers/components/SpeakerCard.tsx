import SpeakerModal from './SpeakerModal'
import SpeakerPhoto from './SpeakerPhoto'
import { ISpeaker } from 'streameth-server/model/speaker'
import { ISession } from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda'

const SpeakerCard = ({
  event,
  speaker,
  sessions,
}: {
  event: IEvent
  speaker: ISpeaker
  sessions: ISession[]
}) => {
  const speakerSessions = sessions.filter((session) =>
    session.speakers.some(
      (sessionSpeaker) => sessionSpeaker.id === speaker.id
    )
  )

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="border-none">
          <CardHeader className="space-y-4">
            <SpeakerPhoto speaker={speaker} size="lg" />
            <CardTitle className="mx-auto">{speaker.name}</CardTitle>
          </CardHeader>
          <CardDescription className=" overflow-clip">
            {speaker.company}
          </CardDescription>
        </Card>
      </CredenzaTrigger>
      <SpeakerModal
        event={event}
        speaker={speaker}
        sessions={speakerSessions}
      />
    </Credenza>
  )
}

export default SpeakerCard
