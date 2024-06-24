'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteDestinationAction } from '@/lib/actions/organizations'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteDestination = ({
  destinationId,
  organizationId,
}: {
  destinationId: string

  organizationId: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const handleDeleteDestination = async () => {
    setIsDeleting(true)
    await deleteDestinationAction({
      destinationId,
      organizationId,
    })
      .then((response) => {
        if (response) {
          toast.success('Destination deleted')
          setOpen(false)
        } else {
          toast.error('Error deleting destination')
        }
      })
      .catch(() => {
        toast.error('Error deleting destination')
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="justify-start" variant={'ghost'}>
          <Trash2 className="text-destructive w-5 h-5 pr-1" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-5 justify-center items-center">
        <div className="bg-destructive rounded-full p-3">
          <Trash2 className="text-white w-5 h-5" />
        </div>
        <p className="text-xl">
          Are you sure you want to delete this Destination?
        </p>
        <DialogFooter className="flex items-center gap-4">
          <DialogClose>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleDeleteDestination}
            loading={isDeleting}
            variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDestination
