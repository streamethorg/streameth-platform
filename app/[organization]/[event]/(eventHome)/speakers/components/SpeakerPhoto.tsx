import { ISpeaker } from '@/server/model/speaker'
import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'

function getFileIdFromUrl(url: string) {
  const regex = /\/file\/d\/([^\/]+)\//
  const match = url && url?.match(regex)
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`
  }
  // Return the original URL if no match is found
  return url
}

function CreateBlockie(username: string) {
  return makeBlockie(username)
}

const SpeakerPhoto = ({
  speaker,
  size,
}: {
  speaker: ISpeaker
  size?: 'sm' | 'md' | 'lg'
}) => {
  let sizeString
  if (size === 'sm') {
    sizeString = 'h-8 w-8 '
  } else if (size === 'md') {
    sizeString = 'h-12 w-12'
  } else {
    sizeString = 'w-full aspect-square rounded'
  }

  return (
    <div className={` relative ${sizeString}`}>
      <img src={speaker.photo
        ? getFileIdFromUrl(speaker.photo)
        : CreateBlockie(speaker.name)} className="rounded-xl object-cover w-full h-full" alt={speaker.name} />
    </div>
  )
}

export default SpeakerPhoto
