'use client'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { ISession } from 'streameth-server/model/session'
import { useEffect, useState } from 'react'
const fetchImage = async (url: string): Promise<boolean> => {
  try {
    const image = await fetch(url)
    if (image.ok) return false
    return true
  } catch (e) {
    return false
  }
}
// TODO
export default function Thumbnail({
  session,
  fallBack,
}: {
  session: ISession
  fallBack?: string
}) {
  const streamethThumbnail = session.coverImage ?? ''

  const [error, setError] = useState(false)
  const [fallbackImage, setFallbackImage] = useState('/cover.png')
  useEffect(() => {
    setError(false)
    fallBack && setFallbackImage(getImageUrl('/events/' + fallBack))
  }, [session.coverImage, fallBack])

  return (
    <div className="aspect-video relative">
      <Image
        className="rounded"
        alt="Session image"
        quality={80}
        src={error ? fallbackImage : streamethThumbnail}
        fill
        style={{
          objectFit: 'cover',
        }}
        onError={(e) => {
          setError(true)
          //e.currentTarget.src = "/cover.png"
          // fetchImage(livepeerThumbnail)
          //   .then(() => {
          //     e.currentTarget.src = livepeerThumbnail
          //   })
          //   .catch(() => {
          //     e.currentTarget.src = 'cover.png'
          //   })
        }}
      />
    </div>
  )
}
