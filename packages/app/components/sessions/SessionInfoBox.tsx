'use server'

import {
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSession } from '@/lib/types'
import { Button } from '../ui/button'
import PopoverActions from '../misc/PopoverActions'

const SessionInfoBox = async ({
  video,
  inverted,
  vod = false,
}: {
  video: IExtendedSession
  inverted?: boolean
  vod?: boolean
}) => {
  return (
    <div
      className={`${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <CardHeader className="flex flex-col justify-start w-full">
        <CardTitle className="items-start px-3 pt-3 text-xl md:px-0 lg:text-2xl">
          <span>{video.name}</span>
        </CardTitle>
        <CardDescription>
          <InfoBoxDescription description={video.description} />
          <div className="flex justify-between items-center mx-3 mb-auto space-x-2 md:justify-end md:mx-0">
            <Button className="w-full md:w-36">Collect Video</Button>
            <Button className="hidden md:block" variant={'outline'}>
              Collect Video
            </Button>
            <PopoverActions session={video} />
          </div>
        </CardDescription>
      </CardHeader>
    </div>
  )
}

export default SessionInfoBox
