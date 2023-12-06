'use client'
import { SocialIcon } from 'react-social-icons'
import SpeakerPhoto from './SpeakerPhoto'
import SpeakerModal from './SpeakerModal'
import { useContext } from 'react'
import { ModalContext } from '@/context/ModalContext'
import { ISpeaker } from 'streameth-server/model/speaker'

export default function SpeakerIcon({
  speaker,
  size = 'sm',
  onlyImage = false,
}: {
  speaker: ISpeaker
  size?: 'sm' | 'md' | 'lg'
  onlyImage?: boolean
}) {
  const { openModal } = useContext(ModalContext)
  return (
    <div
      className={`flex flex-row items-center text-sm rounded-xl cursor-pointer border p-1 `}
      onClick={() => openModal(<SpeakerModal speaker={speaker} />)}>
      <div
        className={`rounded m-2 ${size === 'md' ? 'h-12' : 'h-8'}`}>
        <SpeakerPhoto speaker={speaker} size={'md'} />
      </div>
      {!onlyImage && (
        <span className="text-main-text text-lg">{speaker.name}</span>
      )}
      {speaker.twitter && !onlyImage && (
        <SocialIcon
          url={`https://x.com/${speaker.twitter}`}
          target="_blank"
          bgColor="#000"
          fgColor="#fff"
          style={{ width: '30px', height: '30px' }}
          className="ml-2 "
        />
      )}
    </div>
  )
}
