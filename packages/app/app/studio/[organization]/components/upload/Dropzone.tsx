'use client'
import { useEffect, useRef, useState } from 'react'
import { MutableRefObject } from 'react'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import uploadVideo from '@/lib/uploadVideo'
import {
  getUrlAction,
  getVideoUrlAction,
} from '@/lib/actions/livepeer'
import { Progress } from '@/components/ui/progress'

const Dropzone = ({
  onChange,
  abortControllerRef,
}: {
  onChange: (assetId: string) => void
  abortControllerRef: MutableRefObject<AbortController>
}) => {
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
      onChange(assetId)

      const interval = setInterval(async () => {
        const playbackUrl = await getVideoUrlAction(assetId)
        if (playbackUrl) {
          setVideoUrl(playbackUrl)
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

  if (isUploading && progress >= 100) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
        <p className="m-2">Uploading finished! Processing now...</p>
      </div>
    )
  }

  if (isUploading && progress < 100) {
    return (
      <div className="flex flex-col justify-center items-center p-2 w-full h-full text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
        <p className="m-2">Uploading. Please wait...</p>
        <Progress value={progress} />
      </div>
    )
  }

  if (videoUrl) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
        <p className="m-2">Video is uploaded on Livepeer</p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center w-full h-full text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
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
      <div className="mx-4">
        <p>Drag and drop videos to upload... Or just click here!</p>
        <p>
          Maximum video file size is 10GB. Best resolution of 1920 x
          1080. Aspect ratio of 16:9
        </p>
      </div>
    </div>
  )
}

export default Dropzone
