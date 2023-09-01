import EventController from '@/server/controller/event'
import StudioLayout from './components/StudioLayout'
import StageController from '@/server/controller/stage'

export default async function Studio() {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const events = await new EventController().getAllEvents()
  const stages = await new StageController().getAllStages()
  
  const filteredStages = stages.filter((stage) => pattern.test(stage.streamSettings.streamId))
  const filteredEvents = events.filter((event) => filteredStages.some((stage) => stage.eventId === event.id))

  return <StudioLayout events={filteredEvents} stages={filteredStages} />
}
