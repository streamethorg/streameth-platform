'use client'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils/utils'
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
export default function Thumbnail({
  imageUrl,
  fallBack,
}: {
  imageUrl?: string
  fallBack?: string
}) {
  const streamethThumbnail = imageUrl ?? ''
  const [image, setImage] = useState('')

  const [error, setError] = useState(false)
  const [fallbackImage, setFallbackImage] = useState('/cover.png')
  useEffect(() => {
    setError(false)
    fallBack && setFallbackImage(fallBack)
  }, [imageUrl, fallBack])

  return (
    <div className="aspect-video relative">
      <Image
        placeholder="blur"
        blurDataURL={fallbackImage}
        loading="lazy"
        className="rounded"
        alt="Session image"
        quality={80}
        src={error ? fallbackImage : streamethThumbnail}
        fill
        sizes="(max-width: 768px) 100%, (max-width: 1200px) 50%, 33%"
        style={{
          objectFit: 'cover',
        }}
        onError={(e) => {
          setError(true)
        }}
      />
    </div>
  )
}
