'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@/components/ui/aspect-ratio'

type ThumbnailProps = {
  imageUrl?: string
  fallBack?: string
}

export default function Thumbnail({
  imageUrl,
  fallBack,
}: ThumbnailProps) {
  const [error, setError] = useState(false)
  const [fallbackImage, setFallbackImage] = useState('/cover.png')

  useEffect(() => {
    setError(false)
    if (fallBack) {
      setFallbackImage(fallBack)
    }
  }, [imageUrl, fallBack])

  if (!imageUrl && !fallBack) {
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
        decoding="async"
        data-nimg="fill"
        className="rounded-xl"
        alt="Session image"
        quality={100}
        src={error ? fallbackImage : imageUrl ?? ''}
        fill
        sizes="(max-width: 768px) 100%, (max-width: 1200px) 50%, 33%"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          inset: 0,
          objectFit: 'cover',
        }}
        onError={() => {
          setError(true)
        }}
      />
    </div>
  )
}
