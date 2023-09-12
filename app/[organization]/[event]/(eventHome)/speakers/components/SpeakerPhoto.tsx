import { ISpeaker } from '@/server/model/speaker'
import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'

function CreateBlockie(username: string) {
  if (!username) {
    return ''
  }
  return makeBlockie(username)
}

const SpeakerPhoto = ({ speaker, size }: { speaker: ISpeaker; size?: 'sm' | 'md' | 'lg' }) => {
  const avatar = speaker.photo ?? CreateBlockie(speaker.name)
  let sizeString
  if (size === 'sm') {
    sizeString = 'h-8 w-8'
  } else if (size === 'md') {
    sizeString = 'h-12 w-12'
  } else {
    sizeString = 'h-52 w-40 lg:h-52 w-full'
  }

  return (  
    <div className={`rounded relative ${sizeString}`}>
      <Image src={avatar} alt={speaker.name} fill placeholder="empty" className='rounded' />
    </div>
  )
}

export default SpeakerPhoto
