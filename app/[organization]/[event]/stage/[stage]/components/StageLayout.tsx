import Stage from '@/server/model/stage'
import SessionController from '@/server/controller/session'
import { ChatBubbleBottomCenterIcon, CalendarIcon } from '@heroicons/react/24/outline'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/plugins/Chat'
import Player from '@/components/misc/Player'
import PluginBar from '@/components/Layout/PluginBar'
import ActionsComponent from '../../../session/[session]/components/ActionsComponent'
import SponsorCarousel from '@/components/misc/Sponsors'
import { ISession as SessionType } from '@/server/model/session'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
type Sponsor = {
  name: string
  image: string
}

const sponsoredData: Sponsor[] | null = null

const LeftPane = ({ currentSession, stage }: { currentSession: SessionType; stage: Stage }) => (
  <div className="sticky top-0 z-40 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:overflow-scroll">
    <ActionsComponent stage={stage} />
    <Player streamId={stage.streamSettings.streamId} playerName={currentSession.name} coverImage={currentSession.coverImage} />
    <div className="w-full lg:mt-4 h-full">
    <SessionInfoBox session={currentSession} />
    </div>
    {/* {sponsoredData && <SponsorsCarousel />} */}
  </div>
)

const RightPane = ({ stageId, sessions }: { stageId: string; sessions: SessionType[] }) => (
  <div className="flex flex-col w-full pt-2 lg:p-0 lg:px-2 h-full lg:w-[30%] relative lg:mt-0">
    <PluginBar
      tabs={[
        { id: 'schedule', header: <CalendarIcon />, content: <SessionList sessions={sessions} currentStage={stageId} /> },
        { id: 'chat', header: <ChatBubbleBottomCenterIcon />, content: <Chat conversationId={stageId} /> },
      ]}
    />
  </div>
)

const SponsorsCarousel = () => (
  <div className="hidden lg:flex max-h-[15rem] h-full">{sponsoredData && <SponsorCarousel sponsors={sponsoredData} />}</div>
)

const extractDate = (date: Date) => date.toISOString().split('T')[0]

const getCurrentSession = (sessions: SessionType[]) => {
  const now = new Date().getTime()
  return sessions.find((session) => new Date(session.start).getTime() <= now && new Date(session.end).getTime() >= now) || sessions[0]
}

export default async function StageLayout({ stage }: { stage: Stage }) {
  const sessionController = new SessionController()

  const getSessions = async () => {
    let sessions = await sessionController.getAllSessionsForEvent(stage.eventId)

    if (!sessions || !sessions.length) {
      return []
    }

    sessions = stage.id ? sessions.filter((session) => session.stageId === stage.id) : sessions
    const sortedSessions = sessions.filter((session) => session.start).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    if (!sortedSessions.length) return []

    let currentDate = new Date(sortedSessions[0].start)
    let currentSessions = sortedSessions.filter((session) => session.start && extractDate(session.start) === extractDate(currentDate))

    const lastSessionDate = new Date(sortedSessions[sortedSessions.length - 1].start)
    while (!currentSessions.length && currentDate <= lastSessionDate) {
      currentDate.setDate(currentDate.getDate() + 1)
      currentSessions = sortedSessions.filter((session) => session.start && extractDate(session.start) === extractDate(currentDate))
    }

    return currentSessions.map((session) => session.toJson())
  }

  const sessions = await getSessions()

  if (!sessions.length) {
    return (
      <div>
        <p>There are no sessions scheduled for this stage.</p>
      </div>
    )
  }

  const currentSession = getCurrentSession(sessions)

  return (
    <div className="flex flex-col w-full lg:flex-row relative lg:p-4 lg:gap-4">
      <LeftPane currentSession={currentSession} stage={stage} />
      <RightPane stageId={stage.id} sessions={sessions} />
    </div>
  )
}
