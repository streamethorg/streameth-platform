'use client'

import { getUrlAction } from '@/lib/actions/livepeer'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import UploadVideoForm from './components/UploadVideoForm'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { studioPageParams } from '@/lib/types'

// TODO:
// - Add a progress bar
// - Disable drag and drop for phone
// - State management

// const performUpload = async (
//   url: string,
//   video: File,
//   signal: AbortSignal
// ) => {
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': video.type,
//       },
//       body: video,
//       signal,
//     })
//
//     if (!response.ok) {
//       throw new Error(`Upload failed with status: ${response.status}`)
//     }
//
//     console.log('Video uploaded successfully!')
//   } catch (error) {
//     console.error('Error during video upload:', error)
//   }
// }

const performUpload = (
  video: File,
  signal: AbortSignal,
  onProgress: (percentage: number) => void
) => {
  const xhr = new XMLHttpRequest()

  const formData = new FormData()
  formData.append('file', video)

  xhr.open('POST', '/api/upload-video', true)

  signal.addEventListener('abort', () => {
    xhr.abort()
    console.error('Upload aborted')
  })

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percentage = Math.round(
        (event.loaded / event.total) * 100
      )
      onProgress(percentage)
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('Video uploaded successfully!')
      return
    }
    console.error(`Upload failed with status: ${xhr.status}`)
    console.error(xhr.response)
  }

  xhr.onerror = () => {
    console.error('Error during video upload:', xhr.statusText)
  }

  xhr.send(formData)
}

const Upload = ({ params, searchParams }: studioPageParams) => {
  const { eventId } = searchParams
  const { organization } = params

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

    // await createSessionAction({
    //   session: {
    //     name: '',
    //     description: '',
    //     stageId: '',
    //     eventId,
    //     organizationId: organization,
    //     speakers: [],
    //     start: Date.now(),
    //     end: Date.now(),
    //   },
    // })
    console.log('Uploading video...')
    performUpload(file, signal, (progress) => {
      setProgress(progress)
    })

    // const intervalId = setInterval(
    //   async () => {
    //     if (!assetId) {
    //       console.log('No assetId available yet.')
    //       return
    //     }
    //
    //     console.log('Checking progress...')
    //     const progress = await getProgress(assetId)
    //
    //     if (!progress) {
    //       console.log('Something wrong with the progress...')
    //       return
    //     }
    //
    //     setProgress(progress)
    //     if (progress >= 100) {
    //       clearInterval(intervalId)
    //       console.log('Upload fully processed.')
    //     }
    //   },
    //   1000 * 60 * 1 // Check every 1 minutes
    // )
  }

  const handleCancel = () => {
    setSelectedFile(null)
    abortController.abort()
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full h-full">
      {!selectedFile ? (
        <div>
          <p className="flex justify-center mb-3 text-xl">
            You are about to upload to the event:&nbsp;
            <span className="font-bold">{eventId}</span>
          </p>
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
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <UploadVideoForm />
          <span className="mt-2 font-medium">{progress}%</span>
          <Progress value={progress} className="mt-1 mb-4" />
          <Button
            className="bg-red-300 hover:bg-red-500"
            onClick={handleCancel}>
            Cancel upload...
          </Button>
        </div>
      )}
    </div>
  )
}

export default Upload
