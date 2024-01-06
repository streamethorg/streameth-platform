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
}: {
  session: ISession
}) {
  const livepeerThumbnail = `https://vod-cdn.lp-playback.studio/catalyst-vod-com/hls/${session.playbackId}/thumbnails/keyframes_0.jpg`
  const streamethThumbnail = getImageUrl(`${session.coverImage}`)

  return (
    <div className="aspect-video relative">
      <Image
        className="rounded"
        alt="Session image"
        quality={80}
        src={streamethThumbnail}
        fill
        style={{
          objectFit: 'cover',
        }}
        onError={(e) => {
          console.log(e.currentTarget.src)

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
