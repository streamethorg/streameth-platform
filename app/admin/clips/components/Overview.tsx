'use client'

import { Asset, Player } from '@livepeer/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import Link from 'next/link'

dayjs.extend(duration)

interface Props {
  clips: Asset[]
}

export function Overview(props: Props) {
  return (
    <div className="p-8">
      <h2 className="text-xl">Clips Overview</h2>

      <div className="flex gap-4 flex-wrap mt-5">
        {props.clips.map((clip) => (
          <div key={clip.id} className="w-72">
            <Player
              title={clip.name}
              playbackId={clip.playbackId}
              objectFit="cover"
              priority
              showTitle={false}
              autoUrlUpload={{ fallback: true }}
              showUploadingIndicator={true}
            />
            <Link href={clip.downloadUrl ?? '#'}>Download</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
