'use client'

import {
  useState,
  useCallback,
  useRef,
  type MutableRefObject,
} from 'react'
import UploadVideoForm from './UploadVideoForm'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import Alert from '@/components/misc/interact/Alert'
import { createSessionAction } from '@/lib/actions/sessions'
import { type IExtendedEvent } from '@/lib/types'
import { Progress } from '@/components/ui/progress'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'

const performUpload = (
  video: File,
  abortControllerRef: MutableRefObject<AbortController>,
  onProgress: (percentage: number) => void
) => {
  const formData = new FormData()
  formData.append('file', video)

  const xhr = new XMLHttpRequest()

  abortControllerRef.current.signal.addEventListener('abort', () => {
    console.log('Aborting upload')
    xhr.abort()
  })
  xhr.open('POST', '/api/upload-video', true)

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

const Dropzone = ({
  event,
  stages,
}: {
  event: IExtendedEvent
  stages: IStageModel[]
}) => {
  const abortControllerRef = useRef(new AbortController())

  const [progress, setProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async (file: File) => {
    setSelectedFile(file)

    await createSessionAction({
      session: {
        name: 'No Name',
        description: 'No Description',
        eventId: event._id,
        organizationId: event.organizationId,
        speakers: [],
        stageId: stages[0]._id!,
        start: 0,
        end: 0,
      },
    })
    console.log('Uploading video...')
    performUpload(file, abortControllerRef, (percentage) => {
      setProgress(percentage)
    })
  }

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

  const handleCancel = () => {
    setProgress(0)
    setSelectedFile(null)
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full h-full">
      {!selectedFile ? (
        <div>
          <p className="flex justify-center mb-3 text-xl">
            You are about to upload to the event:&nbsp;
            <span className="font-bold">{event.name}</span>
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
          <Alert
            triggerText="Cancel upload..."
            dialogTitle="Are you sure to cancel the upload?"
            dialogDescription=""
            continueClick={() => handleCancel()}
          />
        </div>
      )}
    </div>
  )
}

export default Dropzone
