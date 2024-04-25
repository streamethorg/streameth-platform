'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteStageAction } from '@/lib/actions/stages'
import { IExtendedStage } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteLivestream = ({ stream }: { stream: IExtendedStage }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const handleDeleteStage = async () => {
    setIsDeleting(true)
    await deleteStageAction({
      stageId: stream._id as string,
      organizationId: stream.organizationId as string,
    })
      .then((response) => {
        if (response) {
          toast.success('Livestream deleted')
          setOpen(false)
        } else {
          toast.error('Error deleting livestream')
        }
      })
      .catch(() => {
        toast.error('Error deleting livestream')
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant={'outline'}>
            <Trash2 className="text-destructive w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-5 justify-center items-center">
          <div className="bg-destructive rounded-full p-3">
            <Trash2 className="text-white w-5 h-5" />
          </div>
          <p className="text-xl">
            Are you sure you want to delete this livestream?
          </p>
          <DialogFooter className="flex items-center gap-4">
            <DialogClose>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>

            <Button
              onClick={handleDeleteStage}
              loading={isDeleting}
              variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteLivestream
