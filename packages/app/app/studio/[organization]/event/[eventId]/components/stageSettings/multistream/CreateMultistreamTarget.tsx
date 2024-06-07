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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMultistreamAction } from '@/lib/actions/stages'
import { ReloadIcon } from '@radix-ui/react-icons'
// TODO
//@ts-ignore
import { useFormState, useFormStatus } from 'react-dom'

const initialState = {
  message: '',
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  if (pending) {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    )
  }
  return <Button type="submit">Create</Button>
}

export const CreateMultistreamTarget = ({
  streamId,
  organizationId,
  btnName = 'Add',
}: {
  streamId?: string
  organizationId?: string
  btnName?: string
}) => {
  const [open, setOpen] = React.useState(false)
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
      <DialogTrigger asChild>
        <Button variant="outline">{btnName}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create multistream target</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
