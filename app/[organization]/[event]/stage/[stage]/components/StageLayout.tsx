'use client'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import {
  ChatBubbleBottomCenterIcon,
  CalendarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import SessionList from '@/components/sessions/SessionList'
import Chat from '@/plugins/Chat'
import Player from '@/components/misc/Player'
import PluginBar from '@/components/Layout/PluginBar'
import ActionsComponent from '@/app/[organization]/[event]/session/[session]/components/ActionsComponent'
import SessionInfoBox from '@/components/sessions/SessionInfoBox'
import { StageContext } from './StageContext'
import EmbedButton from '@/components/misc/EmbedButton'
import ShareButton from '@/components/misc/ShareButton'
import { LoadingContext } from '@/components/context/LoadingContext'

export default function StageLayout() {
  const stickyRef = useRef<HTMLDivElement>(null)
  const [bottomOffset, setBottomOffset] = useState(0)
  const { setIsLoading } = useContext(LoadingContext)

  useLayoutEffect(() => {
    if (stickyRef.current) {
      setBottomOffset(stickyRef.current.clientHeight)
    }
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickyRef.current])

  const context = useContext(StageContext)

  if (!context) return null

  const { stage, sessions, currentSession } = context

  return (
    <div className="h-full flex flex-col w-full lg:flex-row relative lg:p-4 lg:gap-4">
      <div className="h-full flex flex-col w-full lg:flex-row relative p-2 lg:gap-4">
        <div
          ref={stickyRef}
          className=" bg-base p-2 mb-2  md:p-4 rounded-xl sticky top-0 z-30 flex flex-col w-full lg:h-full lg:w-[70%] box-border lg:overflow-scroll
          
          ">
          <ActionsComponent title={stage.name}>
            <EmbedButton
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
            />
            <ShareButton />
          </ActionsComponent>
          <Player
            streamId={stage.streamSettings.streamId}
            playerName={stage.name}
          />
        </div>
        <div className="relative flex flex-grow flex-col w-full pt-0 lg:p-0 lg:px-2 lg:h-full lg:w-[30%] lg:mt-0">
          <PluginBar
            bottomOffset={bottomOffset}
            tabs={[
              {
                id: 'schedule',
                header: <CalendarIcon />,
                content: <SessionList sessions={sessions} />,
              },
              {
                id: 'chat',
                header: <ChatBubbleBottomCenterIcon />,
                content: <Chat conversationId={stage.id} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
