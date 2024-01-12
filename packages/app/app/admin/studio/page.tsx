import EventController from 'streameth-server/controller/event'
import Studio from './components/Studio'
import { GetEvents } from './utils/client'
import StageController from 'streameth-server/controller/stage'

export default async function Page() {
  const controller = new EventController()
  const data = await controller.getAllEvents({})

  const stageController = new StageController()
  const eventsWithStages = await Promise.all(
    data.map(async (event) => {
      const stages = await stageController.getAllStagesForEvent(
        event.id
      )
      return {
        ...event,
        stages,
      }
    })
  )

  const events = JSON.stringify(eventsWithStages)
  const parsedEvents = JSON.parse(events)
  // const events = await GetEvents()

  return <Studio events={parsedEvents} />
}
