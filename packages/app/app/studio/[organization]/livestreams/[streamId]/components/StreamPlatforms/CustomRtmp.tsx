'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createMultistreamAction } from '@/lib/actions/stages'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useFormState, useFormStatus } from 'react-dom'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const initialState = {
  message: '',
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  if (pending) {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
        Please wait
      </Button>
    )
  }
  return <Button type="submit">Create</Button>
}

const CreateCustomStream = ({
  streamId,
  organizationId,
  btnName = 'Add',
}: {
  streamId?: string
  organizationId?: string
  btnName?: string
}) => {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(
    createMultistreamAction,
    initialState
  )

  useEffect(() => {
    if (state.message) {
      toast[state.success ? 'success' : 'error'](state.message)
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form action={formAction} className="grid gap-4">
        <div className="grid grid-cols-4 gap-4 items-center">
          <Input type="hidden" name="streamId" value={streamId} />
          <Input
            type="hidden"
            name="organizationId"
            value={organizationId}
          />
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            className="col-span-3"
            placeholder="e.g. streaming.tv"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 items-center">
          <Label htmlFor="url" className="text-right">
            Ingest URL
          </Label>
          <Input
            id="url"
            name="url"
            className="col-span-3"
            placeholder="e.g. rtmp://streaming.tv/live"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 items-center">
          <Label htmlFor="streamKey" className="text-right">
            Stream key (optional)
          </Label>
          <Input
            id="streamKey"
            name="streamKey"
            className="col-span-3"
            placeholder="e.g. a1b2-4d3c-e5f6-8h7g"
          />
        </div>

        <DialogFooter>
          <SubmitButton />
        </DialogFooter>
        <DialogFooter>
          <div className="flex flex-col">
            <h3 className="font-bold">About</h3>
            <p className="text-muted-foreground">
              Allows you to add a Custom RTMP or more than 1 channel
              of the same platform from our list of supported
              platforms.
            </p>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  )
}

export default CreateCustomStream
