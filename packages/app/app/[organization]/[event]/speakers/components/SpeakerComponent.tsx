import SpeakerCard from './SpeakerCard'

import { fetchEventSpeakers, fetchAllSessions } from '@/lib/data'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IExtendedEvent } from '@/lib/types'

const SpeakerComponent = async ({
  event,
}: {
  event: IExtendedEvent
}) => {
  const speakers = await fetchEventSpeakers({
    event: event.slug,
  })

  const sessionsData = await fetchAllSessions({
    event: event.slug,
  })

  if (!speakers.length) return null

  return (
    <Card
      id="speakers"
      className="text-white bg-opacity-[0.04] bg-white border-white border-opacity-[0.04] lg:rounded-xl shadow">
      <CardHeader>
        <CardTitle className="text-4xl uppercase text-white">
          Speakers
        </CardTitle>
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
