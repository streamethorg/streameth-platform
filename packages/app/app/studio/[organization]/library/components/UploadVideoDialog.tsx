'use client'

import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UploadVideoForm from './upload/UploadVideoForm'
import { useState } from 'react'
import UploadComplete from '@/lib/svg/UploadComplete'

const UploadVideoDialog = ({
  organizationId,
}: {
  organizationId: string
}) => {
  const [isUploaded, setIsUploaded] = useState(false)

  const onFinish = () => {
    setIsUploaded(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'primary'} className="text-white">
          Upload video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] sm:max-h-[800px]">
        {isUploaded ? (
          <>
            <DialogHeader className="p-10 space-y-4">
              <div className="p-4 mx-auto">
                <UploadComplete />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <DialogTitle>
                  Video uploaded succesfully! 🎉
                </DialogTitle>
                <DialogDescription>
                  Your video is currently being processed. This could
                  take several minutes.
                </DialogDescription>
              </div>
            </DialogHeader>
            <Button
              variant={'secondary'}
              className="mx-auto w-1/3 border-2"
              onClick={() => location.reload()}>
              Go back to Assets
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upload Asset</DialogTitle>
              <DialogDescription>
                Upload a video to your library
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <UploadVideoForm
              organizationId={organizationId}
              onFinish={onFinish}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideoDialog
