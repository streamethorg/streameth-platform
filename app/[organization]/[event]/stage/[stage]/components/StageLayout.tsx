'use client'
import ActionsComponent from '@/app/[organization]/[event]/session/[session]/components/ActionsComponent'
import PluginBar from '@/components/Layout/PluginBar'
import { LoadingContext } from '@/components/context/LoadingContext'
import { MobileContext } from '@/components/context/MobileContext'
import EmbedButton from '@/components/misc/EmbedButton'
import Player from '@/components/misc/Player'
import ShareButton from '@/components/misc/ShareButton'
import SessionList from '@/components/sessions/SessionList'
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { Dm3 } from './dm3/DM3'
import { StageContext } from './StageContext'

export default function StageLayout() {
  const stickyRef = useRef<HTMLDivElement>(null)
  const [bottomOffset, setBottomOffset] = useState(0)
  const [playerHeight, setPlayerHeight] = useState(0)
  const { setIsLoading } = useContext(LoadingContext)
  const { isMobile } = useContext(MobileContext)
  useLayoutEffect(() => {
    if (stickyRef.current) {
      setBottomOffset(stickyRef.current.clientHeight + 70)
      setPlayerHeight(stickyRef.current.clientHeight)
    }
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickyRef.current])

  const context = useContext(StageContext)

  if (!context) return null

  const { stage, sessions } = context

  const getPluginTabs = () => {
    const tabs = []

    if (sessions.length > 0) {
      tabs.push({
        id: 'schedule',
        header: <CalendarIcon />,
        content: <SessionList sessions={sessions} />,
      })
    }
    tabs.push({
      id: 'chat',
      header: <ChatBubbleBottomCenterIcon />,
      content: <Dm3 />,
    })

    return tabs
  }
  return (
    <div className="h-full flex flex-col w-full lg:flex-row relative p-4 lg:max-h-screen">
      <div className="h-full flex flex-col w-full lg:flex-row relative lg:gap-4">
        <div
          ref={stickyRef}
          className="bg-black mb-2 lg:mb-0 sticky  p-2 md:p-4 rounded-xl top-[64px] z-40 flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[70%]">
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
        <div
          style={{ height: isMobile ? '100%' : playerHeight }}
          className={`w-full lg:w-[30%]`}>
          <PluginBar
            bottomOffset={bottomOffset}
            tabs={getPluginTabs()}
          />
        </div>
      </div>
    </div>
  )
}
