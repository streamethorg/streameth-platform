'use client'
import ScheduleCardModal from './ScheduleCardModal'
import moment from 'moment-timezone'
import { getEventTimezoneText } from '@/lib/utils/time'
import SpeakerIcon from '@/components/speakers/speakerIcon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda'
import { IExtendedEvent, IExtendedSession } from '@/lib/types'

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
}: {
  event: IExtendedEvent
  session: IExtendedSession
  showTime?: boolean
  speakers?: boolean
}) => {
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now()

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="p-3 lg:p-3 bg-white bg-opacity-10 rounded-lg border-white border-opacity-10">
          <CardHeader className="text-white pb-0 lg:pb-0 p-2 lg:p-2">
            <CardTitle>{session.name}</CardTitle>
            <CardDescription className="text-secondary">
              {showTime && (
                <>
                  {moment(session.start)
                    .tz(event.timezone || 'UTC')
                    .format('HH:mm')}{' '}
                  -{' '}
                  {moment(session.end)
                    .tz(event?.timezone || 'UTC')
                    .format('HH:mm')}{' '}
                  {getEventTimezoneText(event?.timezone || 'UTC')}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 lg:p-2">
            {speakers && (
              <div className="flex py-1 items-center flex-row space-x-2 overflow-auto mt-auto">
                {session.speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
              </div>
            )}
            {isActive && (
              <p className="text-bold text-red-500 ml-auto animate-pulse">
                Live
              </p>
            )}
          </CardContent>
        </Card>
      </CredenzaTrigger>
      <ScheduleCardModal event={event} session={session} />
    </Credenza>
  )
}

export default ScheduleCard
