'use client'

import { getUrlAction } from '@/lib/actions/sessions'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UploadVideoForm from './components/UploadVideoForm'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'

// TODO:
// - Add a progress bar
// - Disable drag and drop for phone

const performUpload = async (video: File, signal: AbortSignal) => {
  try {
    console.log('Uploading file: ', video)
    const url = await getUrlAction(video.name)

    if (!url) throw new Error('Failed to obtain upload URL')

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

    const data = await response.json()
    console.log('Video uploaded successfully:', data)
  } catch (error) {
    console.error('Error during video upload:', error)
  }
}

const Upload = () => {
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

  const handleUpload = (file: File) => {
    console.log('Handeling upload')
    setSelectedFile(file)
    performUpload(file, signal)
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
                console.log('Being called...')
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
            <Button className={'mt-3'} onClick={handleCancel}>
              Cancel upload...
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload
