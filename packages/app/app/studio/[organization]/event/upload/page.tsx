import { studioPageParams } from '@/lib/types'
import VideoPage from './components/VideoPage'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'

// TODO:
// - Disable drag and drop for phone
// - State management
// - Stage should not be mandatory

const Upload = async ({ params, searchParams }: studioPageParams) => {
  const { eventId } = searchParams
  const { organization } = params

  const event = await fetchEvent({ eventId })
  if (!event) {
    return
  }

  const stages = await fetchEventStages({
    eventId,
  })
  if (!stages) {
    return
  }

  return (
    <div className="w-full h-full">
      <VideoPage
        event={event}
        organization={organization}
        stages={stages}
      />
    </div>
  )
}

export default Upload
