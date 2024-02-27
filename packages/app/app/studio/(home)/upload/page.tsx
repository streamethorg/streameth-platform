'use client'

import { getUrlAction } from '@/lib/actions/livepeer'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UploadVideoForm from './components/UploadVideoForm'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { getAssetAction } from '@/lib/actions/livepeer'

// TODO:
// - Add a progress bar
// - Disable drag and drop for phone

const performUpload = async (
  url: string,
  video: File,
  signal: AbortSignal
) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': video.type,
      },
      body: video,
      signal,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`)
    }

    console.log('Video uploaded successfully!')
  } catch (error) {
    console.error('Error during video upload:', error)
  }
}

const getProgress = async (assetId: string) => {
  const progress = await getAssetAction(assetId)
  if (!progress) {
    return null // TODO: Handle this
  }

  return progress
}

const Upload = () => {
  let assetId: string | undefined = undefined
  const [progress, setProgress] = useState<number>(0)
  const abortController = new AbortController()
  const signal = abortController.signal
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['*.mp4'],
    },
    maxFiles: 1,
    onDrop,
  })

  const handleUpload = async (file: File) => {
    setSelectedFile(file)

    const asset = await getUrlAction(file.name)
    if (!asset) throw new Error('Failed to obtain upload URL')

    assetId = asset.assetId
    console.log('Uploading video...')

    performUpload(asset.url, file, signal)
      .then(() => {
        console.log('Upload complete')
      })
      .catch((error) => {
        console.error('Upload failed:', error)
      })

    const intervalId = setInterval(
      async () => {
        if (!assetId) {
          console.log('No assetId available yet.')
          return
        }

        console.log('Checking progress...')
        const progress = await getProgress(assetId)

        if (!progress) {
          console.log('Something wrong with the progress...')
          return
        }

        setProgress(progress)
        console.log('Progress:', progress)

        if (progress >= 100) {
          clearInterval(intervalId)
          console.log('Upload fully processed.')
        }
      },
      1000 * 60 * 1 // Check every 1 minutes
    )
  }

  const handleCancel = () => {
    setSelectedFile(null)
    abortController.abort()
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
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className="flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 h-[550px] w-[700px]">
            <FileUp className={'my-4'} size={65} />
            <input
              {...getInputProps()}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  handleUpload(file)
                }
              }}
            />
            <p>
              Drag and drop videos to upload... Or just click here!
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <UploadVideoForm />
            <Progress value={progress} className="my-4" />
            <Button
              className="bg-red-300 hover:bg-red-500"
              onClick={handleCancel}>
              Cancel upload...
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload
