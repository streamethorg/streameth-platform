import SpeakerModal from './SpeakerModal'
import SpeakerPhoto from './SpeakerPhoto'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { ISpeakerModel } from 'streameth-new-server/src/interfaces/speaker.interface'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'

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
  event: IEventModel
  speaker: ISpeakerModel
  sessions: ISessionModel[]
}) => {
  const speakerSessions = sessions?.filter((session) =>
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
