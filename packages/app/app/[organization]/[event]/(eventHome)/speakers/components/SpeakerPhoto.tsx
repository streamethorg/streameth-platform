import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'
import { ISpeaker } from 'streameth-server/model/speaker'

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
    sizeString = 'w-full aspect-square rounded max-w-[200px]'
  }

  return (
    <div className={` relative ${sizeString}`}>
      <Image
        className="rounded"
        src={
          speaker.photo
            ? getFileIdFromUrl(speaker.photo)
            : CreateBlockie(speaker.name)
        }
        alt={speaker.name}
        fill
        placeholder="empty"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}

export default SpeakerPhoto
