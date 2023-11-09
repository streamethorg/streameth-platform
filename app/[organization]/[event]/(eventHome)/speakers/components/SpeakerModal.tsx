'use client'

import SpeakerPhoto from '../components/SpeakerPhoto'
import ScheduleCard from '@/app/[organization]/[event]/(eventHome)/schedule/components/ScheduleCard'
import { ISession } from '@/server/model/session'
import { ISpeaker } from '@/server/model/speaker'
import { SocialIcon } from 'react-social-icons'

interface Params {
  speaker: ISpeaker
  sessions?: ISession[]
}

const SpeakerModal = ({ sessions, speaker }: Params) => {
  return (
    <div className="flex bg-base text-white flex-col p-4 justify-center w-full items-center space-y-4 md:w-[500px] md:max-w-4xl">
      <div className="flex justify-center items-center w-48 p-2">
        <SpeakerPhoto speaker={speaker} size="lg" />
      </div>
      <div className="flex flex-col w-full max-w-xl space-y-4">
        <div className=" p-4  bg-base rounded-xl">
          <div className="flex gap-1">
            <p className="text-lg font-bold uppercase mb-4">
              {speaker.name}
            </p>
            {speaker.twitter && (
              <SocialIcon
                url={`https://x.com/${speaker.twitter}`}
                target="_blank"
                bgColor="#000"
                fgColor="#fff"
                style={{ width: '25px', height: '25px' }}
                className="ml-2 "
              />
            )}
          </div>
          <p className="text-main-text py-1">{speaker.bio}</p>
        </div>
        {sessions && (
          <div className="flex flex-col text-lg bg-base p-4 rounded-xl space-y-4">
            <p className="font-bold text-lg">Sessions</p>
            {sessions?.map((session, index) => (
              <ScheduleCard
                key={session?.id}
                session={session}
                showTime
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeakerModal
