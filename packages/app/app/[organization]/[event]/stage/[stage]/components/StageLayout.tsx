'use client'
import ActionsComponent from '@/app/[organization]/[event]/session/[session]/components/ActionsComponent'
import PluginBar from '@/components/Layout/PluginBar'
import { LoadingContext } from '@/context/LoadingContext'
import { MobileContext } from '@/context/MobileContext'
import EmbedButton from '@/components/misc/EmbedButton'
import Player from '@/components/misc/Player'
import ShareButton from '@/components/misc/ShareButton'
import SessionList from '@/components/sessions/SessionList'
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { StageContext } from './StageContext'
import LivepeerIcon from '@/components/icons/LivepeerIcon'
import Chat from '@/components/plugins/Chat'
import { IEvent } from 'streameth-server/model/event'
import MintButton from '@/components/misc/MintButton'

export default function StageLayout({ event }: { event: IEvent }) {
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
    {
      !event?.plugins?.disableChat &&
        tabs.push({
          id: 'chat',
          header: <ChatBubbleBottomCenterIcon />,
          // content: <Dm3 />,
          content: <Chat conversationId={stage.id} />,
        })
    }

    return tabs
  }
  return (
    <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-screen lg:gap-4 md:p-4">
      <div className="flex flex-col w-full h-full lg:w-[70%] lg:gap-4">
        <div className="flex flex-col lg:flex-row relative  ">
          <div
            ref={stickyRef}
            className="bg-black mb-2 lg:mb-0 sticky md:rounded-xl top-[64px] z-40 flex flex-col lg:h-full w-full box-border lg:overflow-scroll ">
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
        <div className="flex flex-row relative  ">
          <div className="bg-base  font-ubuntu flex items-center rounded-xl w-fit px-2 m-2 gap-2">
            <p className="text-white">Powered by</p>
            <LivepeerIcon />
          </div>
          <MintButton address="0xD628D7cE49f0796D3e23C5dD1e1C20eDAA224132" />
        </div>
      </div>
      <div
        style={{ height: isMobile ? '100%' : playerHeight }}
        className={`w-full lg:w-[30%] px-2 md:px-0`}>
        <PluginBar
          bottomOffset={bottomOffset}
          tabs={getPluginTabs()}
        />
      </div>
    </div>
  )
}
