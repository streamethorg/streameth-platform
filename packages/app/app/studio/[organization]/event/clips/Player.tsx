'use client'
import React, { useState, useEffect, useCallback } from 'react'

import {
  StreamSession,
  useAsset,
  useStreamSessions,
  MediaControllerCallbackState,
  useCreateClip,
  Player,
} from '@livepeer/react'
import { useClipContext } from './components/ClipContext'

const StudioPlayer = ({ playbackId }: { playbackId: string }) => {
  const { selectedStreamSession, setPlaybackStatus } =
    useClipContext()

  const playbackStatusSelector = useCallback(
    (
      state: MediaControllerCallbackState<HTMLMediaElement, never>
    ) => {
      return {
        progress: Number(state.progress.toFixed(1)),
        offset: Number(state.playbackOffsetMs?.toFixed(1) ?? 0),
      }
    },
    []
  )

  const onPlaybackStatusUpdate = useCallback(
    (state: { progress: number; offset: number }) => {
      setPlaybackStatus(state)
    },
    []
  )
  const src = `${'https://link.storjshare.io/raw/juixm77hfsmhyslrxtycnqfmnlfq/catalyst-recordings-com/hls/'}${playbackId}/${selectedStreamSession?.id}/output.m3u8`

  return (
    <Player
      playRecording
      src={src}
      autoPlay
      muted
      playbackStatusSelector={playbackStatusSelector}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
    />
  )
}

export default StudioPlayer
