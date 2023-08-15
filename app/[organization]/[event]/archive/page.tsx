import FilterBar from './components/FilterBar'
import FilteredItems from './components/FilteredItems'
import { FilterContextProvider } from './components/FilterContext'
import SpeakerController from '@/server/controller/speaker'
import SessionController from '@/server/controller/session'
import StageController from '@/server/controller/stage'

interface Params {
  params: {
    event: string
  }
}

export default async function ArchivePage({ params }: Params) {
  const sessionController = new SessionController()
  const sessions = (await sessionController.getAllSessionsForEvent(params.event)).map((session) => {
    return session.toJson()
  })

  const videoSessions = sessions.filter((session) => {
    return session.videoUrl != undefined
  })

  const speakerController = new SpeakerController()
  const speakers = (await speakerController.getAllSpeakersForEvent(params.event)).map((speaker) => {
    return speaker.toJson()
  })

  const stageController = new StageController()
  const stages = (await stageController.getAllStagesForEvent(params.event)).map((stage) => {
    return stage.toJson()
  })

  return (
    <div className="flex flex-col-reverse justify-end lg:flex-row w-full lg:h-full lg:overflow-hidden">
      <FilterContextProvider items={videoSessions}>
        <FilteredItems />
        <div className="w-full lg:max-w-[20rem] sticky top-0 lg:pt-4 lg:pr-4">
          <FilterBar sessions={videoSessions} speakers={speakers} stages={stages} />
        </div>
      </FilterContextProvider>
    </div>
  )
}
