import { ISpeaker } from '@/server/model/speaker'
import SpeakerPhoto from './SpeakerPhoto'
import Link from 'next/link'

const SpeakerCard = ({ speaker }: { speaker: ISpeaker }) => {
  return (
    <Link
      href={`speakers/${speaker.id}`}
      className="m-2 flex flex-col items-center 
    text-sm bg-white shadow rounded w-40 lg:w-48">
      <SpeakerPhoto speaker={speaker} size="lg" />
      <div className="p-2 min-h-[5rem] gap-y-2 flex justify-center items-center flex-col">
        <span className="lg:text-md text-main-text uppercase w-full ">
          {speaker.name}
        </span>
        {speaker.company && (
          <span className="text-xs text-gray-500 w-full">
            {speaker.company}
          </span>
        )}
      </div>
    </Link>
  )
}

export default SpeakerCard
