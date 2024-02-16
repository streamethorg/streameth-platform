'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import {
  ContextMenu,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import UploadVideoForm from './components/UploadVideoForm'
import { useCreateAsset } from '@livepeer/react'
import { useDropzone } from 'react-dropzone'

// TODO: No drag and drop for phone
//
// TODO:
// Make working cancel button

const CreateAndViewAsset = ({ video }: { video: File }) => {
  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
  } = useCreateAsset({
    sources: [{ name: video.name, file: video }] as const,
  })

  console.log(video)
  console.log(status)

  // const onDrop = useCallback(async (acceptedFiles: File[]) => {
  //   if (
  //     acceptedFiles &&
  //     acceptedFiles.length > 0 &&
  //     acceptedFiles?.[0]
  //   ) {
  //     setVideo(acceptedFiles[0])
  //   }
  // }, [])

  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: {
  //     'video/*': ['*.mp4'],
  //   },
  //   maxFiles: 1,
  //   onDrop,
  // })

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === 'failed'
        ? 0
        : progress?.[0].phase === 'waiting'
        ? 0
        : progress?.[0].phase === 'uploading'
        ? Math.round(progress?.[0]?.progress * 100)
        : progress?.[0].phase === 'processing'
        ? Math.round(progress?.[0]?.progress * 100)
        : null,
    [progress]
  )

  return (
    <Progress value={progressFormatted} className="w-[60 %] my-5" />
  )
}

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileUploaded, setFileUploaded] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = (file: File) => {
    setSelectedFile(file)
    setFileUploaded(true)
  }

  const handleCancel = () => {
    setFileUploaded(false)
    setSelectedFile(null)
  }

  return (
    <div className="flex flex-col p-4 w-full h-full">
      <div className="flex justify-between items-center mb-20">
        <h1>Studio</h1>
        <div className="flex items-center">
          <Link href={'/studio/user'}>
            <div className="mx-3 w-10 h-10 bg-black rounded-full"></div>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {!fileUploaded ? (
          <ContextMenu>
            <ContextMenuTrigger className="flex flex-col justify-center items-center p-4 text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed h-[550px] w-[700px]">
              <h1 className="mb-2 text-center">
                Drag and drop videos to upload
              </h1>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="video/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    handleUpload(file)
                  }
                }}
              />
              <Button onClick={handleButtonClick}>
                Upload video...
              </Button>
            </ContextMenuTrigger>
          </ContextMenu>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <UploadVideoForm />
            {selectedFile && (
              <CreateAndViewAsset video={selectedFile} />
            )}
            <Button onClick={handleCancel}>Cancel upload...</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload
