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
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full ">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{video.name}</span>
        </CardTitle>
        <InfoBoxDescription description={video.description} />
      </div>
      <div className="mb-auto flex justify-between items-center space-x-2 md:justify-end">
        <Button variant={'primary'} className="w-full md:w-36">
          Collect Video
        </Button>
        <Button className="hidden md:block" variant={'outline'}>
          Collect Video
        </Button>
        <PopoverActions session={video} />
      </div>
    </div>
  )
}

export default SessionInfoBox
