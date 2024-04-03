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
import UploadVideoForm from '../upload/UploadVideoForm'

const UploadVideoDialog = ({
  organizationId,
  organizationSlug,
}: {
  organizationId: string
  organizationSlug: string
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'primary'} className="text-white">
          Upload video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] sm:max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
          <DialogDescription>
            Upload a video to your library
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <UploadVideoForm
          organization={organizationId}
          organizationSlug={organizationSlug}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideoDialog
