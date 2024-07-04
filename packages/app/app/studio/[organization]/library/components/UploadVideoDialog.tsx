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
import { useRouter } from 'next/navigation'

const UploadVideoDialog = ({
  organizationId,
}: {
  organizationId: string
}) => {
  const [open, setOpen] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const router = useRouter()

  const onFinish = () => {
    setIsUploaded(true)

    setTimeout(() => {
      setIsUploaded(false)
    }, 10000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outlinePrimary'} className="text-black">
          Upload video
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-h-[800px] sm:max-w-[525px]">
        {isUploaded ? (
          <>
            <DialogHeader className="space-y-4 p-10">
              <div className="mx-auto p-4">
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
              onClick={() => router.refresh()}>
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
