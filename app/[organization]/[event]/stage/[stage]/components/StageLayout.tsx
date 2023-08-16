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

type Sponsor = {
  name: string
  image: string
}

const sponsoredData: Sponsor[] | null = null // [{ name: 'Hello', image: 'world' }]

const LeftPane = ({ currentSession, stage }: { currentSession: SessionType; stage?: Stage }) => (
  <div className="sticky top-0 z-40 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:gap-4 lg:overflow-scroll">
    <ActionsComponent session={currentSession} title />
    {stage && <Player streamId={stage.streamSettings.streamId} playerName={currentSession.name} coverImage={currentSession.coverImage} />}
    {sponsoredData && <SponsorsCarousel />}
  </div>
)

const RightPane = ({ stageId, sessions }: { stageId: string; sessions: SessionType[] }) => (
  <div className="flex flex-col w-full p-4 lg:p-0 lg:px-2 h-full lg:w-[30%] relative lg:mt-0">
    <PluginBar
      tabs={[
        { id: 'chat', header: <ChatBubbleBottomCenterIcon />, content: <Chat conversationId={stageId} /> },
        { id: 'schedule', header: <CalendarIcon />, content: <SessionList sessions={sessions} currentStage={stageId} /> },
      ]}
    />
  </div>
)

const SponsorsCarousel = () => (
  <div className="hidden lg:flex max-h-[15rem] h-full">{sponsoredData && <SponsorCarousel sponsors={sponsoredData} />}</div>
)

export default async function StageLayout({ stage }: { stage: Stage }) {
  const sessionController = new SessionController()

  const getSessions = async () => {
    const sessions = await sessionController.getAllSessionsForEvent(stage.eventId)
    const sortedSessions = sessions.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    const currentDate = new Date().getDate() === sortedSessions[0].start.getDate() ? new Date() : sortedSessions[0].start

    return sortedSessions.filter((session) => session.start.getDate() === currentDate.getDate()).map((session) => session.toJson())
  }

  const getCurrentSession = (sessions: SessionType[]) => {
    return (
      sessions.find(
        (session) => new Date(session.start).getTime() <= new Date().getTime() && new Date(session.end).getTime() >= new Date().getTime()
      ) || sessions[0]
    )
  }

  const sessions = await getSessions()

  if (!sessions) {
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
