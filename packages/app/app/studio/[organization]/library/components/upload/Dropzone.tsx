'use client'

import { useEffect, useState } from 'react'
import { MutableRefObject } from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import uploadVideo from '@/lib/uploadVideo'
import { getUrlAction } from '@/lib/actions/livepeer'

const Dropzone = ({
  onChange,
  abortControllerRef,
}: {
  onChange: (assetId: string) => void
  abortControllerRef: MutableRefObject<AbortController>
}) => {
  const [progress, setProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [assetId, setAssetId] = useState<string | null>(null)

  const startUpload = async (file: File) => {
    setIsUploading(true)
    const uploadUrl = await getUrlAction(file.name)
    if (uploadUrl) {
      uploadVideo(
        file,
        uploadUrl.url,
        abortControllerRef,
        (percentage) => setProgress(percentage),
        async () => {
          setAssetId(uploadUrl.assetId)
        }
      )
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles[0])
      }
    },
    [onChange]
  )

  useEffect(() => {
    if (assetId) {
      onChange(assetId)
    }
  }, [isUploading, assetId])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 5 * 1024 * 1024 * 1024, // 5 GB in bytes
    maxFiles: 1,
    onDrop,
  })

  if (isUploading && progress >= 100) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-40 text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
        <p className="m-2">
          Uploading finished! Processing now... Please proceeed...
        </p>
      </div>
    )
  }

  if (isUploading && progress < 100) {
    return (
      <div className="flex flex-col justify-center items-center p-2 w-full h-40 bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 aspect-video">
        <div className="flex relative justify-center items-center w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded-md opacity-50"></div>
          <div
            className="absolute top-0 left-0 h-full bg-purple-400 rounded-md"
            style={{ width: `${progress}%` }}></div>
          <div className="flex z-10 flex-col justify-center items-center">
            <p>{progress}%</p>
            <p>Uploading. Please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center space-y-2 w-full h-40 text-sm bg-white rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200">
      <FileUp size={35} />
      <input {...getInputProps()} />
      <div className="mx-4">
        <p>Drag and drop videos to upload... Or just click here!</p>
        <p>
          Maximum video file size is 5GB. Best resolution of 1920 x
          1080. Aspect ratio of 16:9
        </p>
      </div>
    </div>
  )
}

export default Dropzone
