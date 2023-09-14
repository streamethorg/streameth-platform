import SpeakerPhoto from '../components/SpeakerPhoto'
import SpeakerController from '@/server/controller/speaker'
import SessionController from '@/server/controller/session'
import ScheduleCard from '@/app/[organization]/[event]/(eventHome)/schedule/components/ScheduleCard'

interface Params {
  params: {
    organization: string
    event: string
    speaker: string
  }
}

export async function generateStaticParams({
  params,
}: {
  params: { organization: string; event: string }
}) {
  const speakerController = new SpeakerController()
  const eventSpeakers =
    await speakerController.getAllSpeakersForEvent(params.event)
  return eventSpeakers.map((speaker) => ({
    event: params.event,
    speaker: speaker.id,
  }))
}

const SpeakerPage = async ({ params }: Params) => {
  const speakerController = new SpeakerController()
  const speaker = (
    await speakerController.getSpeaker(params.speaker, params.event)
  ).toJson()
  const sessionController = new SessionController()
  const speakerSessions = await sessionController.getAllSessions({
    eventId: params.event,
    speakerIds: [params.speaker],
  })

  return (
    <div className="flex flex-col lg:flex-row w-full p-4 justify-center items-center space-y-4 md:space-y-0 md:justify-start md:items-start">
      <div className="flex flex-col justify-center items-center w-48 p-2 border bg-white border-accent rounded shadow">
        <SpeakerPhoto speaker={speaker} size="lg" />
      </div>
      <div className=" md:ml-4 flex flex-col w-full  max-w-xl space-y-4">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-lg font-bold uppercase mb-4">
            {speaker.name}
          </p>
          <p className="text-main-text py-1">{speaker.bio}</p>
        </div>
        <div className="flex flex-col bg-white shadow p-4 rounded space-y-4">
          <p className="font-bold text-lg">Sessions</p>
          {speakerSessions.map((session, index) => (
            <ScheduleCard
              key={session.id}
              session={session.toJson()}
              showTime
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpeakerPage
