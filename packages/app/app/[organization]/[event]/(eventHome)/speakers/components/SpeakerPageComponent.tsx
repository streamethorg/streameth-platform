import SpeakerCard from './SpeakerCard'

import ComponentWrapper from '../../components/ComponentWrapper'
import SessionController from 'streameth-server/controller/session'
import SpeakerController from 'streameth-server/controller/speaker'
import SectionTitle from '../../components/SectionTitle'
import EventController from 'streameth-server/controller/event'
interface Params {
  params: {
    organization: string
    event: string
  }
}

const SpeakerPageComponent = async ({ params }: Params) => {
  const eventController = new EventController()
  const event = await eventController.getEvent(
    params.event,
    params.organization
  )
  const speakerController = new SpeakerController()
  const speakers = await speakerController.getAllSpeakersForEvent(
    params.event
  )
  const sessionController = new SessionController()
  const sessions = await sessionController.getAllSessions({
    eventId: params.event,
  })

  if (!speakers.length) return null

  return (
    <ComponentWrapper sectionId="speakers">
      <SectionTitle title="Speakers" />
      <div className="my-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className="rounded-lg cursor-pointer transition-colors">
            <SpeakerCard
              event={event.toJson()}
              speaker={speaker.toJson()}
              sessions={sessions.map((session) => session.toJson())}
            />
          </div>
        ))}
      </div>
    </ComponentWrapper>
  )
}

export default SpeakerPageComponent
