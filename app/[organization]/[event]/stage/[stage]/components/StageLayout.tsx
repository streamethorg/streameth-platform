"use client"
import { useContext } from 'react'
import { ChatBubbleBottomCenterIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/plugins/Chat'
import Player from '@/components/misc/Player'
import PluginBar from '@/components/Layout/PluginBar'
import ActionsComponent from '../../../session/[session]/components/ActionsComponent'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { MobileContext } from '@/components/context/MobileContext'
import { DayData } from '@/app/api/organizations/[id]/events/[eventId]/schedule/route'

export default function StageLayout({ data }: { data: DayData }) {
  const stage = data.stages[0].stage
  const sessions = data.stages[0].sessions
  const currentSession = sessions[0]
  const { isMobile } = useContext(MobileContext)

  const tabs = [
    { id: 'schedule', header: <CalendarIcon />, content: <SessionList sessions={sessions} /> },
    { id: 'chat', header: <ChatBubbleBottomCenterIcon />, content: <Chat conversationId={stage.id} /> },
  ];

  if (isMobile) {
    tabs.unshift({ id: 'info', header: <InformationCircleIcon />, content: <SessionInfoBox session={currentSession} /> });
  }

  return (
    <div className="flex flex-col w-full lg:flex-row relative lg:p-4 lg:gap-4">
      <div className="sticky top-0 z-40 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:overflow-scroll">
        <ActionsComponent title={stage.name} />
        <Player streamId={stage.streamSettings.streamId} playerName={currentSession.name} coverImage={currentSession.coverImage} />
        <div className="hidden md:flex w-full lg:mt-4 h-full">
          <SessionInfoBox session={currentSession} />
        </div>
      </div>
      <div className="flex flex-col w-full pt-2 lg:p-0 lg:px-2 h-full lg:w-[30%] relative lg:mt-0">
        <PluginBar
          tabs={tabs}
        />
      </div>
    </div>
  )
}
