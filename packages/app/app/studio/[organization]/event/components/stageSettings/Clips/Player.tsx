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
import { useClipContext } from './ClipContext'

const StudioPlayer = () => {
  const {
    selectedStreamSession,
    setSelectedStreamSession,
    playbackStatus,
    setPlaybackStatus,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
  } = useClipContext()

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

  return (
    <Player
      // src={
      //   isCreatingClip
      //     ?
      //     : undefined
      // }
      src={selectedStreamSession?.recordingUrl}
      // playbackId={selectedStreamSession?.playbackId}
      autoPlay
      muted
      playbackStatusSelector={playbackStatusSelector}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
    />
  )
}

export default StudioPlayer
