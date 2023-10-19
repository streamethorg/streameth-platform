import { ISpeaker } from '@/server/model/speaker'
import SpeakerPhoto from './SpeakerPhoto'
import Link from 'next/link'

const SpeakerCard = ({ speaker, path }: { speaker: ISpeaker; path: string }) => {
  return (
    <Link href={path} className="flex flex-col text-sm rounded w-full">
      <div className="border shadow rounded-xl w-32 lg:w-44 mx-auto">
        <SpeakerPhoto speaker={speaker} size="lg" />
      </div>
      <div className="mx-auto text-center mt-2">
        <h3 className="text-md lg:text-lg md:text-xl mb-0">{speaker.name}</h3>
        <p className="text-black-500 text-md">{speaker.company}</p>
      </div>
    </Link>
  )
}

export default SpeakerCard
