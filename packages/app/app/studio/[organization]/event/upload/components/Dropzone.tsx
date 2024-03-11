'use client'
import { useEffect, useRef, useState } from 'react'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import uploadVideo from '../lib/uploadVideo'
import {
  getUrlAction,
  getVideoUrlAction,
} from '@/lib/actions/livepeer'
import { Progress } from '@/components/ui/progress'
import PlayerWithControls from '@/components/ui/Player'

const Dropzone = ({
  onChange,
}: {
  onChange: (assetId: string) => void
}) => {
  const abortControllerRef = useRef(new AbortController())
  const [progress, setProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [assetId, setAssetId] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      const uploadUrl = await getUrlAction(acceptedFiles[0].name)
      if (acceptedFiles && acceptedFiles.length > 0 && uploadUrl) {
        const file = acceptedFiles[0]
        uploadVideo(
          file,
          uploadUrl?.url,
          abortControllerRef,
          (percentage) => {
            setProgress(percentage)
          },
          async () => {
            setAssetId(uploadUrl?.assetId as string)
          }
        )
      }
    },
    [onChange]
  )

  useEffect(() => {
    if (assetId) {
      const interval = setInterval(async () => {
        const playbackUrl = await getVideoUrlAction(assetId)
        if (playbackUrl) {
          setVideoUrl(playbackUrl)
          onChange(assetId)
          setIsUploading(false)
          clearInterval(interval)
        }
        console.log(playbackUrl)
      }, 3000)
    }
  }, [isUploading, assetId])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    onDrop,
  })

  if (isUploading) {
    return (
      <div className="aspect-video flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 w-full h-full">
        <p>Uploading. Please wait..</p>
        <Progress value={progress} />
      </div>
    )
  }

  if (videoUrl) {
    return (
      <div className="aspect-video flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 w-full h-full">
        <PlayerWithControls
          src={[
            {
              src: videoUrl as `${string}m3u8`,
              width: 1920,
              height: 1080,
              mime: 'application/vnd.apple.mpegurl',
              type: 'hls',
            },
          ]}
        />
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className=" aspect-video flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 w-full h-full">
      <FileUp className={'my-4'} size={65} />
      <input
        {...getInputProps()}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            setSelectedFile(file)
          }
        }}
      />
      <p>Drag and drop videos to upload... Or just click here!</p>
    </div>
  )
}

export default Dropzone
