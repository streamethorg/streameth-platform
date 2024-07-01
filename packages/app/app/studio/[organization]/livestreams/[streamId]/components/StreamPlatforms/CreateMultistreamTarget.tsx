'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import StreamPlatformGrid from './StreamPlatforms'

export const CreateMultistreamTarget = ({
  streamId,
  organizationId,
  btnName = 'Add',
}: {
  streamId: string
  organizationId: string
  btnName?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outlinePrimary" className="space-x-1">
          <Plus />
          <span className="">{btnName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-8 bg-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            Create multistream target
          </DialogTitle>
        </DialogHeader>
        <StreamPlatformGrid
          streamId={streamId}
          organizationId={organizationId}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  )
}
