'use client'
import React from 'react'
import EmbedButton from '@/components/misc/EmbedButton'
import ShareButton from '@/components/misc/ShareButton'
import Player from '@/components/misc/Player'
import ActionsComponent from '@/app/[organization]/[event]/session/[session]/components/ActionsComponent'
import Image from 'next/image'
import Link from 'next/link'
import { IStage } from '@/server/model/stage'

const LiveEvent = ({ stage }: { stage: IStage }) => {
  return (
    <div>
      <h3 className="font-ubuntu font-bold text-lg px-4 text-blue">
        Happening Now!
      </h3>
      <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-screen">
        <div className="h-full flex flex-col w-full lg:flex-row relative items-center lg:gap-4">
          <div
            // ref={stickyRef}
            className=" mb-2 lg:mb-0 p-4 rounded-xl flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[75%]">
            {/* <ActionsComponent title={stage.name}>
              <EmbedButton
                streamId={stage.streamSettings.streamId}
                playerName={stage.name}
              />
              <ShareButton />
            </ActionsComponent> */}
            <Player
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
            />
            <p className="font-ubuntu font-medium text-lg mt-4 text-blue">
              🔴 Live: ZuConnect - Public Goods Track
            </p>
          </div>
          <div
            // style={{ height: isMobile ? '100%' : playerHeight }}
            className={`w-full lg:w-[45%] mr-4 flex flex-col gap-4 mb-4`}>
            <p className="hidden lg:block font-ubuntu font-medium text-lg text-blue">
              ZuConnect Istanbul 2023
            </p>
            <Image
              className="hidden lg:block"
              src={'/events/zuzalu-cover.png'}
              alt="Zazulu 2023"
              width={700}
              height={700}
            />
            <Link
              href="/zuzalu/zuconnect__public_goods_track"
              className=" bg-blue rounded-[8px] p-4 mx-4 lg:mx-0 text-white text-center">
              Go to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveEvent
