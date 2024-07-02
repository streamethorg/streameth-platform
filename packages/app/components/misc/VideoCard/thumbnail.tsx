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
  const srcUrl = imageUrl || fallBack

  if (!srcUrl) {
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
        blurDataURL={srcUrl}
        loading="lazy"
        decoding="async"
        data-nimg="fill"
        className="rounded-xl"
        alt="Session image"
        quality={100}
        src={srcUrl}
        fill
        sizes="(max-width: 768px) 100%, (max-width: 1200px) 50%, 33%"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          inset: 0,
          objectFit: 'cover',
        }}
      />
    </div>
  )
}
