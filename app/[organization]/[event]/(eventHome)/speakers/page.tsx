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
    <div className="m-2 flex flex-col items-center text-sm h-52 w-40 lg:h-64 lg:w-52 bg-white shadow rounded">
      <div className="relative h-48  w-full">
        <Image src={avatar} alt={speaker.name} fill placeholder="empty" />
      </div>
      <span className="lg:text-lg text-main-text uppercase p-2 flex justify-center items-center flex-1 w-full ">{speaker.name}</span>
    </div>
  )
}

const SpeakerPage = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speakers = (await speakerController.getAllSpeakersForEvent(params.event)).map((speaker) => speaker.toJson())

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center text-sm mb-4">
        <span className="text-xl text-accent cursor-pointer font-bold box-border flex flex-col justify-center p-2 bg-white shadow-b w-full">Speakers</span>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center h-full overflow-scroll">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </div>
  )
}

export default SpeakerPage
