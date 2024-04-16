import { Checkbox } from '@/components/ui/checkbox'
import { TabsContent } from '@/components/ui/tabs'
import { INFTSessions } from '@/lib/types'
import { formatDate } from '@/lib/utils/time'
import Image from 'next/image'
import React from 'react'
import { ICreateNFT } from './CreateNFTForm'

const AddMediaTabItem = ({
  tabValue,
  videos,
  formState,
  setFormState,
}: {
  setFormState: React.Dispatch<React.SetStateAction<ICreateNFT>>
  formState: ICreateNFT
  tabValue: string
  videos: INFTSessions[]
}) => {
  const parsedVideos = videos.map((video) => ({
    ...video,
    videoType: tabValue,
  }))

  return (
    <TabsContent
      className="max-h-[450px] overflow-auto"
      value={tabValue}>
      {parsedVideos.length === 0 && (
        <div className="mt-12 text-muted-foreground">
          No {tabValue} found.
        </div>
      )}
      {parsedVideos.map((video) => (
        <div
          className="flex items-center gap-3 mt-8 mb-4"
          key={video._id}>
          <div>
            <Checkbox
              checked={formState?.selectedVideo?.some(
                (v) => v._id === video._id
              )}
              onCheckedChange={() =>
                setFormState((prevState) => ({
                  ...prevState,
                  selectedVideo: prevState.selectedVideo.some(
                    (v) => v._id === video._id
                  )
                    ? prevState.selectedVideo.filter(
                        (v) => v._id !== video._id
                      )
                    : [...prevState.selectedVideo, video],
                }))
              }
            />
          </div>
          <div className="min-w-[200px] w-[200px]">
            <Image
              className="rounded-xl w-full"
              src={
                video.coverImage
                  ? video.coverImage
                  : '/images/videoPlaceholder.png'
              }
              alt={video.name}
              width={200}
              height={112}
            />
          </div>
          <div>
            <h4 className="font-medium mb-1">{video.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
            <p className="text-sm">
              {' '}
              {formatDate(
                new Date(video.createdAt as string),
                'MMM. D, YYYY'
              )}
            </p>
          </div>
        </div>
      ))}
    </TabsContent>
  )
}

export default AddMediaTabItem
