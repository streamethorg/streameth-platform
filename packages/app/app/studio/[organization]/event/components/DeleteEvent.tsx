'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { deleteEventAction } from '@/lib/actions/events'
import { IExtendedEvent } from '@/lib/types'
import { Trash2 } from 'lucide-react'
import { ReactNode } from 'react'

const DeleteAsset = ({
  event,
  TriggerComponent,
}: {
  event: IExtendedEvent
  TriggerComponent: ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    setIsLoading(true)
    await deleteEventAction({
      organizationId: event.organizationId as string,
      eventId: event._id,
    })
    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      <DialogContent className="p-10 sm:max-w-[475px]">
        <DialogHeader className="mx-auto space-y-4">
          <div className="p-4 mx-auto bg-red-500 rounded-full">
            <Trash2 className="text-white" />
          </div>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mx-auto">
          <DialogClose>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            loading={isLoading}
            onClick={() => handleDelete()}
            variant={'destructive'}>
            Delete event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAsset
