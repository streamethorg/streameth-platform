import StageAccordion from './navigation/stageAccordion'
import StreamConfig from './StreamConfig'
import Clips from './Clips'
import { fetchEventStages, fetchEventSessions } from '@/lib/data'
import { NavigationProvider } from './navigation/navigationContext'
const StageSettings = async ({
  eventId,
  selectedStage,
}: {
  eventId: string
  selectedStage: string
}) => {
  const [stages, sessions] = await Promise.all([
    fetchEventStages({
      eventId,
    }),
    fetchEventSessions({
      event: eventId,
    }),
  ])

  const stage =
    stages.filter((stage) => stage._id === selectedStage)[0] ||
    stages[0]

  console.log(
    'sessions',
    sessions.sessions.filter(
      (session) => session.stageId === stage._id
    )
  )
  return (
    <NavigationProvider>
      <div className="w-1/6 min-w-[300px] h-full border-r">
        <StageAccordion stages={stages} />
      </div>
      <div className="w-full h-full">
        {!stage ? (
          <div>create a stage</div>
        ) : (
          <div className="p-2 bg-gray-100 h-full">
            <StreamConfig stage={stage} />
            <Clips
              stage={stage}
              sessions={sessions.sessions.filter(
                (session) => session.stageId === stage._id
              )}
            />
          </div>
        )}
      </div>
    </NavigationProvider>
  )
}

export default StageSettings
