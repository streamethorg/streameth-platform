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
    <div className="flex flex-col h-full max-w-7xl w-full mx-auto p-2">
      <span
        className=" box-border flex flex-col justify-center p-2 bg-white shadow-b w-full my-4 text-5xl">
        Speakers
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} />
        ))}
      </div>
    </div>
  )
}

export default SpeakerPage
