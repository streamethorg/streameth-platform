import SpeakerController from '@/server/controller/speaker'
import { ISpeaker } from '@/server/model/speaker'
import Image from 'next/image'
import SpeakerIcon from '@/components/speakers/SpeakerIcon'
import makeBlockie from 'ethereum-blockies-base64'

function CreateBlockie(username: string) {
  if (!username) {
    return ''
  }
  return makeBlockie(username)
}

interface Params {
  params: {
    event: string
    organization: string
  }
}

const SpeakerCard = ({ speaker }: { speaker: ISpeaker }) => {
  const avatar = speaker.photo ?? CreateBlockie(speaker.name)

  return (
    <div className="flex flex-row items-center text-sm h-32  bg-white shadow rounded">
      <div className="relative h-full  aspect-square">
        <Image src={avatar} alt={speaker.name} fill placeholder="empty" />
      </div>
      <span className="text-main-text text-xl">{speaker.name}</span>
    </div>
  )
}

const SpeakerPage = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speakers = (await speakerController.getAllSpeakersForEvent(params.event)).map((speaker) => speaker.toJson())

  return (
    <div className="flex flex-col overflow-scroll min-h-screen p-8">
      <div className="flex flex-row items-center text-sm mb-4">
        <span className="text-main-text text-2xl">Speakers</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </div>
  )
}

export default SpeakerPage
