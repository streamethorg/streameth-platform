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
  const avatar =
    speaker.photo != '' ? speaker.photo : CreateBlockie(speaker.name)
  let sizeString
  if (size === 'sm') {
    sizeString = 'h-8 w-8'
  } else if (size === 'md') {
    sizeString = 'h-12 w-12'
  } else {
    sizeString = 'w-full h-44 lg:h-52'
  }

  return (
    <div className={`rounded relative ${sizeString}`}>
      <Image
        src={avatar ?? CreateBlockie(speaker.name)}
        alt={speaker.name}
        fill
        placeholder="empty"
        className="rounded"
      />
    </div>
  )
}

export default SpeakerPhoto
