'use client'

import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  MutableRefObject,
} from 'react'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import uploadVideo from '@/lib/uploadVideo'
import { getUrlAction } from '@/lib/actions/livepeer'

interface DropzoneProps {
  onChange: (assetId: string) => void
  abortControllerRef: MutableRefObject<AbortController>
}

const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  (props, ref) => {
    const { onChange, abortControllerRef } = props
    const [progress, setProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)
    const [assetId, setAssetId] = useState<string | null>(null)

    const startUpload = async (file: File) => {
      setIsUploading(true)
      const uploadUrl = await getUrlAction(file.name)
      if (uploadUrl) {
        uploadVideo(
          file,
          uploadUrl?.tusEndpoint as string,
          abortControllerRef,
          (percentage) => setProgress(percentage),
          async () => {
            setAssetId(uploadUrl.assetId as string)
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
        <div
          ref={ref}
          className="flex aspect-video h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 text-sm transition-colors hover:bg-gray-200">
          <p className="m-2">
            Uploading finished! Processing now... Please proceed...
          </p>
        </div>
      )
    }

    if (isUploading && progress < 100) {
      return (
        <div
          ref={ref}
          className="flex aspect-video h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-100 p-2 transition-colors hover:bg-gray-200">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute left-0 top-0 h-full w-full rounded-md bg-gray-300 opacity-50"></div>
            <div
              className="absolute left-0 top-0 h-full rounded-md bg-purple-400"
              style={{ width: `${progress}%` }}></div>
            <div className="z-10 flex flex-col items-center justify-center">
              <p>{progress}%</p>
              <p>Uploading. Please wait...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className="flex h-40 w-full cursor-pointer flex-col items-center justify-center space-y-2 rounded-md border-2 border-dashed border-gray-300 bg-white text-sm transition-colors hover:bg-gray-200">
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
)

Dropzone.displayName = 'Dropzone'

export default Dropzone
