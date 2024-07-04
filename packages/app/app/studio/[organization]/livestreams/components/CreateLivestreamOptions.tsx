'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, Radio } from 'lucide-react'
import React from 'react'

const CreateLivestreamOptions = ({
  setStreamType,
}: {
  setStreamType: React.Dispatch<
    React.SetStateAction<'instant' | 'schedule' | undefined>
  >
}) => {
  return (
    <DialogContent className="bg-white sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create livestream</DialogTitle>
        <DialogDescription>
          When do you want to go live?
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col space-y-3">
        <div
          className="cursor-pointer rounded-md border p-3 hover:bg-secondary"
          onClick={() => setStreamType('instant')}>
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-muted p-2">
              <Radio />
            </div>
            <div className="flex flex-col">
              <h3 className="text-foreground">Right now</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Stream to your audience in real-time.
              </p>
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer items-center rounded-md border p-3 hover:bg-secondary"
          onClick={() => setStreamType('schedule')}>
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-muted p-2">
              <Calendar />
            </div>

            <div className="flex flex-col">
              <h3>Schedule a stream</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule a stream for later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default CreateLivestreamOptions
