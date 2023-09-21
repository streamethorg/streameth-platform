import { ISpeaker } from '@/server/model/speaker'
import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'

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
  const avatar = speaker.photo
    ? speaker.photo
    : CreateBlockie(speaker.name)
  let sizeString
  if (size === 'sm') {
    sizeString = 'h-8 w-8'
  } else if (size === 'md') {
    sizeString = 'h-12 w-12'
  } else {
    sizeString = 'w-full aspect-square'
  }

  console.log(speaker.photo)
  return (
    <div className={` relative ${sizeString}`}>
        <Image
          src={speaker.photo ? speaker.photo : CreateBlockie(speaker.name)} 
          alt={speaker.name}
          fill
          placeholder="empty"
        />
    </div>
  )
}

export default SpeakerPhoto
