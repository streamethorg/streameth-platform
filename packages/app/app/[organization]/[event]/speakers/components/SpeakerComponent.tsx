import SpeakerCard from './SpeakerCard'

import { fetchEventSpeakers, fetchEventSessions } from '@/lib/data'
import { IEvent } from 'streameth-server/model/event'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SpeakerComponent = async ({ event }: { event: IEvent }) => {
  const speakers = await fetchEventSpeakers({
    event: event.id,
  })

  const sessions = await fetchEventSessions({
    event: event.id,
  })

  if (!speakers.length) return null

  return (
    <Card id="speakers" className="border-none">
      <CardHeader>
        <CardTitle className="text-4xl uppercase">Speakers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
        {speakers.map((speaker) => (
          <SpeakerCard
            key={speaker.id}
            event={event}
            speaker={speaker}
            sessions={sessions}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default SpeakerComponent
