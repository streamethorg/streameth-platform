'use client'
import React from 'react'
import Player from '@/components/misc/Player'
import Image from 'next/image'
import Link from 'next/link'
import { IStage } from '@server/model/stage'
import { getImageUrl } from '@/utils'

const LiveEvent = ({ stage }: { stage: IStage }) => {
  return (
    <div>
      <h3 className="font-ubuntu font-bold px-4 mt-4 text-4xl text-blue">
        Happening Now!
      </h3>
      <div className="h-full flex flex-col w-full lg:flex-row relative lg:max-h-screen">
        <div className="h-full flex flex-col w-full lg:flex-row relative items-center lg:gap-4">
          <div className=" mb-2 lg:mb-0 p-4 rounded-xl flex flex-col lg:h-full w-full box-border lg:overflow-scroll lg:w-[75%]">
            <Player
              streamId={stage.streamSettings.streamId}
              playerName={stage.name}
              muted
            />
            <p className="font-ubuntu font-medium text-2xl mt-4 text-blue">
              🔴 Live: Light Client Summit
            </p>
          </div>
          <div
            className={`w-full lg:w-[45%] lg:mr-4 flex flex-col gap-4 lg:mb-6`}>
            <p className="hidden lg:block font-ubuntu font-medium text-lg text-blue">
              DevConnect - Light Client Summit
            </p>
            <Image
              className="hidden lg:block"
              src={getImageUrl('/events/LightClient_Cover.jpg')}
              alt="Light Client Summit"
              width={700}
              height={700}
            />
            <Link
              href="/devconnect/light_client_summit"
              className=" bg-blue rounded-xl p-4 mx-4 lg:mx-0 text-white text-center">
              Go to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveEvent
