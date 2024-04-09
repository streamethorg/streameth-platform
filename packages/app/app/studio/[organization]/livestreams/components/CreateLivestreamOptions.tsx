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
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Create livestream</DialogTitle>
        <DialogDescription>
          When do you want to go live?
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col space-y-3">
        <div
          className="
        border rounded-md p-3 hover:bg-secondary cursor-pointer"
          onClick={() => setStreamType('instant')}>
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <Radio />
            </div>
            <div className="flex flex-col">
              <h3 className="text-foreground">Right now</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Stream to your audience in real-time.
              </p>
            </div>
          </div>
        </div>
        <div
          className="
        border rounded-md p-3 hover:bg-secondary items-center cursor-pointer"
          onClick={() => setStreamType('schedule')}>
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              <Calendar />
            </div>

            <div className="flex flex-col">
              <h3>Schedule a stream</h3>
              <p className="text-muted-foreground mt-1 text-sm">
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
