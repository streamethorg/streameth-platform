'use client'
import Speaker, { ISpeaker } from '@/server/model/speaker'
import SpeakerIcon from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerIcon'

export default function SpeakerIconList({
  speakers,
}: {
  speakers: ISpeaker[]
}) {
  return (
    <div className={`flex flex-row flex-wrap gap-2`}>
      {speakers.map((speaker) => (
        <div key={speaker.id} className="flex flex-row gap-2">
          <SpeakerIcon size="md" key={speaker.id} speaker={speaker} />
        </div>
      ))}
    </div>
  )
}
