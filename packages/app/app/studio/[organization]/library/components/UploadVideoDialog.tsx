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
import { Video } from 'lucide-react'

const UploadVideoDialog = ({
  organizationId,
  organizationSlug,
}: {
  organizationId: string
  organizationSlug: string
}) => {
  const [isUploaded, setIsUploaded] = useState(false)

  const onFinish = () => {
    setIsUploaded(true)
  }

  const reload = () => {
    location.reload()
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
              <div className="p-4 mx-auto bg-purple-500 rounded-full border">
                <Video size={70} />
              </div>
              <DialogTitle className="mx-auto">
                Video uploaded succesfully! 🎉
              </DialogTitle>
              <DialogDescription className="mx-auto">
                Your video is currently being processed. This could
                take several minutes.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant={'secondary'}
              className="mx-auto w-1/3"
              onClick={() => reload()}>
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
              organizationSlug={organizationSlug}
              onFinish={onFinish}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideoDialog
