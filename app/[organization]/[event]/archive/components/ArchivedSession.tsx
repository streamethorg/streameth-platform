import { ISession } from '@/server/model/session'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/misc/Card'

const ArchivedSession = ({ session, learnMore = false, goToStage = false }: { session: ISession; learnMore?: boolean; goToStage?: boolean }) => {
  const [image, setImage] = useState(session.coverImage)
  console.log('image', image)
  const [fallback, setFallback] = useState(false)
  const alt = '/events/' + session.eventId + '.png'

  const handleError = () => {
    // if (!fallback) {
    //   setImage(alt)
    //   setFallback(true)
    // } else {
    //   setImage('/cover.png')
    // }
  }

  const component = (
    <Card>
      <div className="aspect-video relative w-full">
        <Image
          className="rounded"
          alt="Session image"
          quality={60}
          src={image!}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          style={{
            objectFit: 'cover',
          }}
          onError={handleError}
        />
      </div>
      {/* <p className="border-b-2 border-accent p-2 py-4 flex flex-grow text-md ">{session.name}</p>  */}
    </Card>
  )

  if (learnMore) return <Link href={'session/' + session.id}>{component}</Link>
  if (goToStage) return <Link href={'/stage/' + session.stageId}>{component}</Link>

  return component
}

export default ArchivedSession
