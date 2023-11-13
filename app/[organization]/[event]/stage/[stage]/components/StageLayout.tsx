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
import LivepeerIcon from '@/app/assets/icons/LivepeerIcon'
import Chat from '@/plugins/Chat'

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
      // content: <Dm3 />,
      content: <Chat conversationId={stage.id} />,
    })

    return tabs
  }
  return (
    <div className="h-full flex flex-col w-full lg:flex-row relative p-4 lg:max-h-screen lg:gap-4">
      <div className="flex flex-col w-full h-full lg:w-[70%] gap-4">
        <div className="flex flex-col lg:flex-row relative  ">
          <div
            ref={stickyRef}
            className="bg-black mb-2 lg:mb-0 sticky  px-2 md:px-4 rounded-xl top-[64px] z-40 flex flex-col lg:h-full w-full box-border lg:overflow-scroll ">
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
        </div>
        <div className="bg-base font-ubuntu flex items-center gap-2 px-4 mb-3 rounded-xl w-fit">
          <p className="text-white">Powered by</p>
          <LivepeerIcon />
        </div>
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
  )
}
