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

const initialState = {
  message: '',
  success: false,
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
      <DialogTrigger asChild>
        <Button variant="primary" className="space-x-2">
          <Plus />
          <span className="font-bold">{btnName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-8 bg-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            Create multistream target
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
