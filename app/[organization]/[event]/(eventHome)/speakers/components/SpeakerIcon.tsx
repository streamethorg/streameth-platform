'use client'
import { SocialIcon } from 'react-social-icons'
import { ISpeaker } from '@/server/model/speaker'
import SpeakerPhoto from './SpeakerPhoto'

export default function SpeakerIcon({
  speaker,
  size = 'sm',
  onlyImage = false,
}: {
  speaker: ISpeaker
  size?: 'sm' | 'md' | 'lg'
  onlyImage?: boolean
}) {
  return (
    <div className={`flex flex-row items-center text-sm ${size === 'md' ? 'h-12' : 'h-8'}`}>
      <div className="rounded m-2">
        <SpeakerPhoto speaker={speaker} size={'md'} />
      </div>
      {!onlyImage && <span className="text-main-text text-lg">{speaker.name}</span>}
      {speaker.twitter && !onlyImage && (
        <SocialIcon
          url={`https://twitter.com/${speaker.twitter}`}
          target="_blank"
          bgColor="#fff"
          fgColor="#1DA1F2"
          className={`ml-2 ${size === 'md' ? 'h-8 w-8' : 'h-8 w-8'}`}
        />
      )}
    </div>
  )
}
