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
import {
  useUpdateStream,
  MultistreamTargetRef,
} from '@livepeer/react'
import { Loader2 } from 'lucide-react'

export const CreateMultistreamTarget = ({
  streamId,
  currentTargets,
  refetch,
}: {
  streamId: string
  currentTargets: MultistreamTargetRef[]
  refetch: () => void
}) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [streamKey, setStreamKey] = useState('')
  const [profile, setProfile] = useState('source')
  const [open, setOpen] = React.useState(false)

  const {
    mutate: updateStream,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useUpdateStream({
    streamId,
    multistream: {
      targets: [
        ...currentTargets,
        {
          profile: 'source',
          spec: {
            name,
            url: url + '/' + streamKey,
          },
        },
      ],
    },
  })

  useEffect(() => {
    if (isSuccess) {
      setName('')
      setUrl('')
      setStreamKey('')
      setProfile('source')
      setOpen(false)
      toast('Multistream target added successfully')
      refetch()
    }
    if (isError) {
      console.error('Failed to add multistream target:', error)
      toast('Error adding multistream target')
    }

    return () => {
      // cleanup
      setName('')
      setUrl('')
      setStreamKey('')
      setProfile('source')
      setOpen(false)
    }
  }, [isSuccess, isError, error, refetch])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create multistream target</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateStream?.()
          }}
          className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              className="col-span-3"
              placeholder="e.g. a1b2-4d3c-e5f6-8h7g"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Profile</Label>
            <div className="col-span-3 flex">
              <div className="flex items-center mr-4">
                <Input
                  type="radio"
                  name="profile"
                  value="source"
                  checked={profile === 'source'}
                  onChange={() => setProfile('source')}
                />
                <Label className="ml-2">Source</Label>
              </div>
              <div className="flex items-center mr-4">
                <Input
                  type="radio"
                  name="profile"
                  value="720p"
                  checked={profile === '720p'}
                  onChange={() => setProfile('720p')}
                />
                <Label className="ml-2">720p</Label>
              </div>
              {/* Repeat for other options like 480p, 360p */}
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">Create target</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
