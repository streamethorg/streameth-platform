'use client'

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
import { deleteMultistreamAction } from '@/lib/actions/stages'
import { Loader2, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DeleteMultistream = ({
  streamId,
  organizationId,
  targetId,
}: {
  streamId?: string
  organizationId: string
  targetId?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)

  if (!streamId || !targetId) return null

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteMultistreamAction(
        streamId,
        organizationId,
        targetId
      )
      toast.success('Multistream target deleted')
    } catch (error) {
      toast.error("Couldn't delete multistream target")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={isLoading}
          className="flex gap-1"
          variant="outline">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div>
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10 sm:max-w-[475px]">
        <DialogHeader className="mx-auto space-y-4">
          <div className="mx-auto rounded-full bg-red-500 p-4">
            <Trash2 className="text-white" />
          </div>
          <DialogTitle>
            Are you sure you want to delete this multistream?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mx-auto">
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            loading={isLoading}>
            Delete Multistream
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMultistream
