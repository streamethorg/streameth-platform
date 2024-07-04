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
      className="border-white border-opacity-[0.04] bg-white bg-opacity-[0.04] text-white shadow lg:rounded-xl">
      <CardContent className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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

export const SpeakerComponentSkeleton = () => {
  // Assuming you want to show a placeholder for 8 speakers as an example
  const skeletonSpeakers = Array(8).fill(0)

  return (
    <div className="animate-pulse border-white border-opacity-[0.04] bg-white bg-opacity-[0.04] text-white shadow lg:rounded-xl">
      <div className="p-3 lg:p-6">
        <div className="h-10 w-1/4 rounded bg-gray-300"></div>{' '}
        {/* Title Placeholder */}
      </div>
      <div className="p-3 lg:p-6">
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {skeletonSpeakers.map((_, index) => (
            <div
              key={index}
              className="h-56 w-full rounded-lg bg-gray-300"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpeakerComponent
