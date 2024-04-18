'use client'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IExtendedSession, INFTSessions } from '@/lib/types'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import AddMediaTabItem from './AddMediaTabItem'
import SelectedMediaItem from './SelectedMediaItem'
import { ICreateNFT } from './CreateNFTForm'

const AddMedia = ({
  videos,
  stages,
  setFormState,
  formState,
  type,
}: {
  stages: INFTSessions[]
  formState: ICreateNFT
  setFormState: React.Dispatch<React.SetStateAction<ICreateNFT>>
  videos: INFTSessions[]
  type: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const filteredVideos = videos?.filter((v) => v.type !== 'clip')
  const clips = videos?.filter((v) => v.type === 'clip')
  const handleRemoveSelected = (itemToRemove: IExtendedSession) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedVideo: prevState.selectedVideo.filter(
        (video) => video !== itemToRemove
      ),
    }))
  }

  return (
    <div>
      <CardTitle className="text-2xl font-semibold mb-4">
        Add Media
      </CardTitle>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">
          <div className="flex gap-2 items-center justify-center h-[100px] bg-muted border-dashed border p-5 w-full border-muted-foreground rounded-xl text-muted-foreground text-sm">
            <div>
              <PlusCircle className="w-5 h-5" />
            </div>
            Add media from your gallery, livestreams and videos.
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-[400px] lg:min-w-[700px]">
          <DialogTitle>Add Media from your library</DialogTitle>
          <div className="">
            <Tabs defaultValue={'videos'}>
              <TabsList className="border-y border-grey w-full !justify-start gap-5">
                <TabsTrigger value="livestreams">
                  Livestreams
                </TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="clips">Clips</TabsTrigger>
              </TabsList>
              <AddMediaTabItem
                formState={formState}
                setFormState={setFormState}
                tabValue="videos"
                videos={filteredVideos}
                type={type}
              />
              <AddMediaTabItem
                formState={formState}
                setFormState={setFormState}
                tabValue="livestreams"
                videos={stages}
                type={type}
              />
              <AddMediaTabItem
                formState={formState}
                setFormState={setFormState}
                tabValue="clips"
                videos={clips}
                type={type}
              />
            </Tabs>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setFormState({ ...formState, selectedVideo: [] })
                setIsOpen(false)
              }}
              className="border-none shadow-none"
              variant="destructive-outline">
              Cancel
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="primary">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="lg:grid md:grid-cols-2 lg:grid-cols-3 gap-5 gap-x-4">
        {formState?.selectedVideo?.map((video: IExtendedSession) => (
          <SelectedMediaItem
            handleRemoveSelected={handleRemoveSelected}
            key={video._id}
            video={video}
          />
        ))}
      </div>
    </div>
  )
}

export default AddMedia
