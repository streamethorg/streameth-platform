import SpeakerCard from './SpeakerCard'
import SpeakerController from '@/server/controller/speaker'
import SessionController from '@/server/controller/session'
interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

const SpeakerPageComponent = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speakers = await speakerController.getAllSpeakersForEvent(params.event)
  const sessionController = new SessionController()
  const sessions = await sessionController.getAllSessions({
    eventId: params.event,
  })

  if (!speakers.length) return null

  return (
    <div id="speakers" className="flex flex-col max-w-7xl w-full mx-auto p-2">
      <span className=" box-border flex flex-col justify-center p-2 bg-white shadow-b w-full my-4 text-5xl">Speakers</span>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="hover:bg-gray-50 p-4 rounded-lg cursor-pointer transition-colors">
            <SpeakerCard speaker={speaker.toJson()} sessions={sessions.map((session) => session.toJson())} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpeakerPageComponent
