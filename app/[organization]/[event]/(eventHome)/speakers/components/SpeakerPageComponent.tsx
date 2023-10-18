import SpeakerController from '@/server/controller/speaker'
import SpeakerCard from './SpeakerCard'

interface Params {
  params: {
    event: string
    organization: string
  }
}

const SpeakerPageComponent = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speakers = (await speakerController.getAllSpeakersForEvent(params.event)).map((speaker) => speaker.toJson())

  return (
    <div className="flex flex-col max-w-7xl w-full mx-auto p-2">
      <div className="w-full bg-white shadow-b my-4 p-2 text-5xl flex justify-center pb-8 font-bold">Speakers</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.id} speaker={speaker} path={`/${params.organization}/${params.event}/speakers/${speaker.id}`} />
        ))}
      </div>
    </div>
  )
}

export default SpeakerPageComponent
