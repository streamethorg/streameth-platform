'use client'
import React, { createContext, useContext, useState } from 'react'

type PlaybackStatus = {
  progress: number
  offset: number
}

type PlaybackTime = {
  displayTime: string
  unix: number
}

type ClipContextType = {
  playbackStatus: PlaybackStatus | null
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >
  startTime: PlaybackTime | null
  setStartTime: React.Dispatch<
    React.SetStateAction<PlaybackTime | null>
  >
  endTime: PlaybackTime | null
  setEndTime: React.Dispatch<
    React.SetStateAction<PlaybackTime | null>
  >
}

const ClipContext = createContext<ClipContextType | null>(null)

export const useClipContext = () => useContext(ClipContext)!

export const ClipProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [playbackStatus, setPlaybackStatus] =
    useState<PlaybackStatus | null>(null)
  const [startTime, setStartTime] = useState<PlaybackTime | null>(
    null
  )
  const [endTime, setEndTime] = useState<PlaybackTime | null>(null)

  return (
    <ClipContext.Provider
      value={{
        playbackStatus,
        setPlaybackStatus,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
      }}>
      {children}
    </ClipContext.Provider>
  )
}
