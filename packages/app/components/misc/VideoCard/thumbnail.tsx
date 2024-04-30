'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function Thumbnail({
  imageUrl,
  fallBack,
}: {
  imageUrl?: string
  fallBack?: string
}) {
  const streamethThumbnail = imageUrl ?? ''

  const [error, setError] = useState(false)
  const [fallbackImage, setFallbackImage] = useState('/cover.png')
  useEffect(() => {
    setError(false)
    fallBack && setFallbackImage(fallBack)
  }, [imageUrl, fallBack])

  if (!streamethThumbnail && !fallBack) {
    return (
      <AspectRatio
        ratio={16 / 9}
        className="flex justify-center items-center w-full">
        <DefaultThumbnail />
      </AspectRatio>
    )
  }

  return (
    <div className="aspect-video relative w-full">
      <Image
        placeholder="blur"
        blurDataURL={fallbackImage}
        loading="lazy"
        className="rounded-xl"
        alt="Session image"
        quality={100}
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
