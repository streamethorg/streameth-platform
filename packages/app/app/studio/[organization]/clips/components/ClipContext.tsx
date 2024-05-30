'use client'
import React, { createContext, useContext, useState } from 'react'

type PlaybackStatus = {
  progress: number
  offset: number
}

type PlaybackTime = {
  displayTime: number
  unix: number
}

type ClipContextType = {
  playbackStatus: PlaybackStatus | null
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >
  startTime: PlaybackTime
  setStartTime: React.Dispatch<
    React.SetStateAction<PlaybackTime>
  >
  endTime: PlaybackTime
  setEndTime: React.Dispatch<
    React.SetStateAction<PlaybackTime>
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
  const [startTime, setStartTime] = useState<PlaybackTime>({
    displayTime: 0,
    unix: 0,
  })
  const [endTime, setEndTime] = useState<PlaybackTime>({
    displayTime: 0,
    unix: 0,
  })

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
