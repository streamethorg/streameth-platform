import SpeakerIcon from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerIcon'
import { IEvent } from 'streameth-server/model/event'
import { ISpeaker } from 'streameth-server/model/speaker'

export default function SpeakerIconList({
  event,
  speakers,
}: {
  event: IEvent
  speakers: ISpeaker[]
}) {
  return (
    <div className={`flex flex-row flex-wrap gap-2`}>
      {speakers.map((speaker) => (
        <div key={speaker.id} className="flex flex-row gap-2">
          <SpeakerIcon
            size="md"
            key={speaker.id}
            speaker={speaker}
            event={event}
          />
        </div>
      ))}
    </div>
  )
}
