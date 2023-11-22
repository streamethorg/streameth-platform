'use client'

import { Player, Stream } from '@livepeer/react'
import Link from 'next/link'
import PlayerHealth from './PlayerHealth'

interface Props {
  streams: Stream[]
}

export default function StreamOverview(props: Props) {
  if (!props.streams) return <>No active streams found.</>

  return (
    <div className="p-8">
      <h2 className="text-xl">Stream Overview</h2>

      <div className="flex gap-4 flex-wrap mt-5">
        {props.streams.map((i) => (
          <div key={i.id} className="w-[400px]">
            <PlayerHealth stream={i} />
          </div>
        ))}
      </div>
    </div>
  )
}
