'use client'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { ChatBubbleBottomCenterIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/plugins/Chat'
import Player from '@/components/misc/Player'
import PluginBar from '@/components/Layout/PluginBar'
import ActionsComponent from '@/app/[organization]/[event]/session/[session]/components/ActionsComponent'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { StageContext } from './StageContext'
import EmbedButton from '@/components/misc/EmbedButton'
import ShareButton from '@/components/misc/ShareButton'

export default function StageLayout() {
  const stickyRef = useRef<HTMLDivElement>(null)
  const [bottomOffset, setBottomOffset] = useState(0)

  useLayoutEffect(() => {
    if (stickyRef.current) {
      setBottomOffset(stickyRef.current.clientHeight)
    }
  }, [stickyRef.current])

  const context = useContext(StageContext)
  if (!context) return null
  const { stage, sessions, currentSession } = context

  return (
    <div className="flex flex-col w-full lg:flex-row relative lg:p-4 lg:gap-4">
      <div ref={stickyRef} className="sticky top-0 z-30 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:overflow-scroll">
        <ActionsComponent title={stage.name}>
          <EmbedButton streamId={stage.streamSettings.streamId} playerName={stage.name} />
          <ShareButton />
        </ActionsComponent>
        <Player streamId={stage.streamSettings.streamId} playerName={stage.name} />
        <div className="hidden lg:flex w-full lg:mt-4 h-full">
          <SessionInfoBox session={currentSession} />
        </div>
      </div>
      <div className="flex w-full lg:mt-4 h-full p-4 lg:hidden">
        <SessionInfoBox session={currentSession} />
      </div>
      <div className="relative flex flex-col w-full p-4 lg:p-0 lg:px-2 h-full lg:w-[30%] lg:mt-0">
        <PluginBar
          bottomOffset={bottomOffset}
          tabs={[
            { id: 'schedule', header: <CalendarIcon />, content: <SessionList sessions={sessions} /> },
            { id: 'chat', header: <ChatBubbleBottomCenterIcon />, content: <Chat conversationId={stage.id} /> },
          ]}
        />
      </div>
    </div>
  )
}
