'use client'
import { VideoFactoryAbi, VideoFactoryAddress } from '@/lib/contract'
import React, { useState } from 'react'
import { useWatchContractEvent } from 'wagmi'

const useVideoContractEvent = () => {
  const [nftContractAddress, setNftContractAddress] = useState()
  useWatchContractEvent({
    address: VideoFactoryAddress,
    abi: VideoFactoryAbi,
    eventName: 'VideoCreated',
    onLogs(logs) {
      //@ts-ignore
      setNftContractAddress(logs[0]?.args?.videoCollectionAddress)
      console.log('New logs!', logs)
    },
  })
  return { nftContractAddress }
}

export default useVideoContractEvent
