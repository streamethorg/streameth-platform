'use client'
import ActionsComponent from '@/app/[organization]/[event]/session/components/ActionsComponent'
import PluginBar from '@/components/Layout/PluginBar'
import { LoadingContext } from '@/context/LoadingContext'
import { MobileContext } from '@/context/MobileContext'
import EmbedButton from '@/components/misc/EmbedButton'
import Player from '@/components/ui/Player'
import ShareButton, {
  ShareWithText,
} from '@/components/misc/ShareButton'
import SessionList from '@/components/sessions/SessionList'
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { StageContext } from './StageContext'
import LogoDark from '@/public/logo_dark.png'
import Chat from '@/components/plugins/Chat'
import { IEvent } from 'streameth-server/model/event'
import Link from 'next/link'
import Image from 'next/image'

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

    if (sessions.length > 0 && !event?.plugins?.hideSchedule) {
      tabs.push({
        id: 'schedule',
        header: <CalendarIcon />,
        content: <SessionList event={event} sessions={sessions} />,
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
      <div className="flex flex-col w-full h-full lg:w-[75%] lg:gap-4">
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
        <div className="flex flex-col md:flex-row relative justify-center items-start mb-2  ">
          <div className="flex flex-col">
            <div className="  font-ubuntu flex items-center rounded-xl w-fit px-2 m-2 text-center gap-4">
              <p className="text-black font-bold text-xl">
                Built by{' '}
              </p>
              <Image
                src={LogoDark}
                alt="logo"
                width={200}
                height={60}
              />
            </div>
            <div className="  font-ubuntu flex items-center rounded-xl w-fit px-2 m-2 text-center gap-4">
              <p className="text-black font-bold text-xl">
                Powered by{' '}
              </p>
              <Image
                src="/livepeer-logo.png"
                alt="logo"
                width={120}
                height={60}
              />
            </div>
          </div>
          <ShareWithText text="Share this event" />
        </div>
      </div>
      <div
        style={{ height: isMobile ? '100%' : playerHeight }}
        className={`w-full lg:w-[25%] px-2 md:px-0`}>
        <PluginBar
          bottomOffset={bottomOffset}
          tabs={getPluginTabs()}
        />
      </div>
    </div>
  )
}
