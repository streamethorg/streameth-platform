'use server'

import {
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { IExtendedSession, IExtendedStage } from '@/lib/types'
import { Button } from '../ui/button'
import { formatDate } from '@/lib/utils/time'

const SessionInfoBox = async ({
  video,
  stage,
  inverted,
  vod = false,
}: {
  video?: IExtendedSession
  stage?: IExtendedStage
  inverted?: boolean
  vod?: boolean
}) => {
  if (!stage && !video) {
    return null
  }

  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{video?.name || stage?.name}</span>
        </CardTitle>
        <InfoBoxDescription
          description={
            video?.description ||
            stage?.description ||
            'No description'
          }
        />
        <p className="hidden md:block">
          {formatDate(
            new Date(video?.createdAt! || stage?.streamDate!),
            'ddd. MMMM. D, YYYY'
          )}
        </p>
      </div>
      <div className="flex justify-between items-center mb-auto space-x-2 md:justify-end">
        <Button variant={'primary'} className="w-full md:w-36">
          Set Reminder
        </Button>
        <Button className="hidden md:block" variant={'outline'}>
          Set Reminder
        </Button>
      </div>
    </div>
  )
}

export default SessionInfoBox
