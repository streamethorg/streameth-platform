'use client'
import Speaker, { ISpeaker } from '@/server/model/speaker'
import SpeakerIcon from '@/app/[organization]/[event]/(eventHome)/speakers/components/SpeakerIcon'
import SpeakerModal from './SpeakerModal'

export default function SpeakerIconList({ speakers }: { speakers: ISpeaker[] }) {
  return (
    <div className={`flex flex-col gap-2`}>
      {speakers.map((speaker) => (
        <div key={speaker.id} onClick={() => openModal(<SpeakerModal speaker={speaker} />)} className="flex flex-row gap-2">
          <SpeakerIcon size="md" key={speaker.id} speaker={speaker} />
        </div>
      ))}
    </div>
  )
}
