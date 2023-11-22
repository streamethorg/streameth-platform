'use client'

import { Player, Stream, useStream } from '@livepeer/react'
import Link from 'next/link'
import dayjs from 'dayjs'

interface Props {
  stream: Stream
}

export default function PlayerHealth(props: Props) {
  const { data: stream } = useStream({
    streamId: props.stream.id,
    refetchInterval: 5000,
  })

  return (
    <div className="w-full">
      <Link
        href={`https://livepeer.studio/dashboard/streams/${props.stream.id}`}
        className="underline">
        <h3>{props.stream.name}</h3>
      </Link>

      <Player
        title={stream?.name}
        playbackId={stream?.playbackId}
        objectFit="cover"
        showTitle
        showUploadingIndicator
        priority
        autoPlay
        muted
      />

      {stream && (
        <ul>
          <li>Active: {stream.isActive?.toString()}</li>
          <li>Recording: {stream.record?.toString()}</li>
          <li>Healthy: {(stream as any).isHealthy?.toString()}</li>
          <li>Ingest: {stream.ingestRate}</li>
          <li>
            Last seen: {dayjs(stream?.lastSeen).format('HH:mm:ss')}
          </li>
        </ul>
      )}
    </div>
  )
}
