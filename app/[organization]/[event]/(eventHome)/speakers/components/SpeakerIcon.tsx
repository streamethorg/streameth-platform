'use client'
import { SocialIcon } from 'react-social-icons'
import { ISpeaker } from '@/server/model/speaker'
import SpeakerPhoto from './SpeakerPhoto'
import SpeakerModal from './SpeakerModal'
import { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'

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
          className={`ml-2 ${
            size === 'md' ? 'h-8 w-h-8' : 'h-8 w-8'
          }`}
        />
      )}
    </div>
  )
}
