import SpeakerController from '@/server/controller/speaker'
import SpeakerCard from './components/SpeakerCard'

interface Params {
  params: {
    event: string
    organization: string
  }
}

const SpeakerPage = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speakers = (await speakerController.getAllSpeakersForEvent(params.event)).map((speaker) => speaker.toJson())

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center text-sm mb-4">
        <span
          className="text-xl text-accent cursor-pointer
         font-bold box-border flex flex-col justify-center p-2 bg-white shadow-b w-full h-14">
          Speakers
        </span>
      </div>
      <div
        className="flex flex-row flex-wrap items-center 
      justify-center h-full overflow-scroll p-2">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </div>
  )
}

export default SpeakerPage
