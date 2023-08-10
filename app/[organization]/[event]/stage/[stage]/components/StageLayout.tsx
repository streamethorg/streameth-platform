import Stage from '@/server/model/stage'
import SessionController from '@/server/controller/session'
import { InformationCircleIcon, ChatBubbleBottomCenterIcon, CalendarIcon } from '@heroicons/react/24/outline'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/plugins/Chat'
import Player from '@/components/misc/Player'
import PluginBar from '@/components/Layout/PluginBar'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import ActionsComponent from '../../../session/[session]/components/ActionsComponent'

export default async function StageLayout({ stage }: { stage: Stage }) {
  const sessionController = new SessionController()
  const getCurrentSessionForStage = async () => {
    const sessions = await sessionController.getAllSessionsForEvent(stage.eventId)
    const stageSessions = sessions.filter((ses) => ses.stageId === stage.id)
    for (const session of stageSessions) {
      const now = new Date()
      if (session.start <= now && session.end >= now) {
        return session
      }
    }
    return stageSessions[stageSessions.length - 1]
  }

  const getSessionsForStage = async () => {
    const sessions = await sessionController.getAllSessionsForEvent(stage.eventId)
    const stageSessions = sessions.filter((ses) => ses.stageId === stage.id)
    const now = new Date()
    return stageSessions.filter((ses) => ses.end >= now)
  }

  const sessions = (await getSessionsForStage()).sort((a, b) => a.start.getTime() - b.start.getTime())
  const currentSession = await getCurrentSessionForStage()

  if (!currentSession) {
    return (
      <div>
        <p>There are no sessions scheduled for this stage.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full lg:flex-row relative lg:p-4 lg:gap-4">
      <div className="sticky top-0 z-40 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:gap-4 lg:overflow-scroll">
        <div className="md:relative">
          <ActionsComponent session={currentSession} title />
          <Player playbackId={currentSession.playbackId} playerName={currentSession.name} coverImage={currentSession.coverImage} />
        </div>
      </div>
      <div className="flex flex-col w-full lg:px-2 h-full lg:w-[30%] relative">
        <PluginBar
          tabs={[
            {
              id: 'chat',
              header: <ChatBubbleBottomCenterIcon />,
              content: <Chat conversationId={stage.id} />,
            },
            {
              id: 'schedule',
              header: <CalendarIcon />,
              content: <SessionList sessions={sessions} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
