'use client'
import Speaker from '@/server/model/speaker'
import makeBlockie from 'ethereum-blockies-base64'
import { SocialIcon } from 'react-social-icons'
import Image from 'next/image'
import { ISpeaker } from '@/server/model/speaker'
function CreateBlockie(username: string) {
  if (!username) {
    return ''
  }
  return makeBlockie(username)
}

interface Props {
  speaker: ISpeaker
  size?: 'sm' | 'md'
  onSpeakerClick?: (speaker: Speaker) => void
  onlyImage?: boolean
  twitter?: boolean
}

export default function SpeakerIcon({ speaker, onSpeakerClick, size = 'sm', onlyImage = false }: Props) {
  const avatar = speaker.photo ?? CreateBlockie(speaker.name)

  return (
    <div className={`flex flex-row items-center text-sm ${size === 'md' ? 'h-12' : 'h-8'}`}>
      <div
        onClick={() => onSpeakerClick?.(speaker)}
        className={`relative flex items-center justify-center rounded mr-2 ${size === 'md' ? 'h-12 w-12' : 'h-8 w-8'}`}>
        <Image src={avatar} alt={speaker.name} layout="fill" className="rounded" placeholder="empty" />
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
