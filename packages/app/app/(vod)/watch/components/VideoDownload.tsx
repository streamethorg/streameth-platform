'use client'
import React, { useState } from 'react'
import { useAsset } from '@livepeer/react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import { ArrowDownIcon } from '@heroicons/react/24/outline'
const VideoDownload = ({ assetId }: { assetId: string }) => {
  const { data: asset, isLoading } = useAsset({ assetId })

  if (isLoading) return null
  if (!asset?.downloadUrl) return null

  return (
    <a
      href={asset.downloadUrl}
      download={asset.name}
      target="_blank"
      className="flex justify-center items-center">
      <Badge className="bg-background my-auto">
        <ArrowDownIcon className="p-1 h-6 w-6 lg:h-8 lg:w-8 cursor-pointer text-white" />
        Download
      </Badge>
    </a>
  )
}

export default VideoDownload
