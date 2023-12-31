'use client'
import React from 'react'
import Player from '@/components/ui/Player'
import Image from 'next/image'
import Link from 'next/link'
import { IStage } from 'streameth-server/model/stage'
import { getImageUrl } from '@/lib/utils'

const LiveEvent = ({ stage }: { stage: IStage }) => {
  return (
    <div>
      <h3 className="font-ubuntu font-bold px-4 mt-4 text-4xl text-blue">
        Happening Now!
      </h3>
      <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-screen">
        <div className="h-full flex flex-col w-full lg:flex-row relative items-center lg:gap-4">
          <div className=" mb-2 lg:mb-0 p-4 rounded-xl flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[80%]">
            <Player
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
              muted
            />
            <p className="font-ubuntu font-medium text-2xl mt-4 text-blue">
              🔴 Live: Base House
            </p>
          </div>
          <div
            className={`w-full lg:items-center lg:w-[40%] lg:mr-4 flex flex-col gap-4 lg:mb-6`}>
            <p className="hidden lg:block font-ubuntu font-medium text-lg text-blue">
              Base House
            </p>
            <Image
              className="hidden lg:block"
              src={getImageUrl('/events/Base-house.jpg')}
              alt="Base House"
              width={400}
              height={400}
            />
            <Link
              href="/base/base_event"
              className=" bg-black rounded-xl p-4 mx-4 lg:mx-0 text-white text-center">
              Go to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveEvent
