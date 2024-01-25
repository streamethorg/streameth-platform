import SpeakerCard from './SpeakerCard'

import { fetchEventSpeakers, fetchEventSessions } from '@/lib/data'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SpeakerComponent = async ({
  event,
}: {
  event: IEventModel
}) => {
  const speakers = await fetchEventSpeakers({
    event: event.slug,
  })

  const sessionsData = await fetchEventSessions({
    event: event.slug,
  })

  if (!speakers.length) return null

  return (
    <Card id="speakers" className="border-none">
      <CardHeader>
        <CardTitle className="text-4xl uppercase">Speakers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {speakers.map((speaker) => (
          <SpeakerCard
            key={speaker._id}
            event={event}
            speaker={speaker}
            sessions={sessionsData.sessions}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default SpeakerComponent
