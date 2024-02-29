'use client'

import { useState, useRef, Suspense } from 'react'
import UploadVideoForm from './UploadVideoForm'
import { createSessionAction } from '@/lib/actions/sessions'
import { type IExtendedEvent } from '@/lib/types'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { getUrlAction } from '@/lib/actions/livepeer'
import type { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import uploadVideo from '../lib/uploadVideo'
import InstructionBanner from './InstructionBanner'
import Dropzone from './Dropzone'
import UploadProgress from './UploadProgress'

const VideoPage = ({
  event,
  organization,
  stages,
}: {
  event: IExtendedEvent
  organization: string
  stages: IStageModel[]
}) => {
  const abortControllerRef = useRef(new AbortController())

  const [progress, setProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [session, setSession] = useState<ISession | null>(null)

  const handleUpload = async (file: File) => {
    const asset = await getUrlAction(file.name)
    const session = await createSessionAction({
      session: {
        name: 'No Name',
        description: 'No Description',
        eventId: event._id,
        organizationId: event.organizationId,
        speakers: [],
        stageId: stages[0]._id!,
        assetId: asset?.assetId,
        start: 0,
        end: 0,
      },
    })
    setSelectedFile(file)
    setSession(session)

    console.log('Uploading video...')
    uploadVideo(
      file,
      asset?.url!,
      abortControllerRef,
      (percentage) => {
        setProgress(percentage)
      }
    )
  }

  const handleCancel = () => {
    setProgress(0)
    setSession(null)
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
          <Dropzone
            setSelectedFile={setSelectedFile}
            handleUpload={handleUpload}
          />
        </div>
      ) : (
        <Suspense fallback={<div>Loading session data...</div>}>
          <div className="max-w-[28%]">
            <div className="flex flex-col justify-center items-center">
              <InstructionBanner progress={progress} />
              <UploadVideoForm
                session={session!}
                organization={organization}
                progress={progress}
              />
            </div>
            <UploadProgress
              organization={organization}
              session={session!}
              progress={progress}
              handleCancel={handleCancel}
            />
          </div>
        </Suspense>
      )}
    </div>
  )
}

export default VideoPage
