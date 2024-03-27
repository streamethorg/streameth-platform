'use client'

import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UploadVideoForm from './upload/UploadVideoForm'

const UploadAsset = ({ organization }: { organization: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'primary'} className="text-white">
          Upload video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
          <DialogDescription>
            Upload a video to your library
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <UploadVideoForm
          organization={organization}
          organizationSlug={organization}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UploadAsset