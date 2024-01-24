'use client'
import ScheduleCardModal from './ScheduleCardModal'
import moment from 'moment-timezone'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { getEventTimezoneText } from '@/lib/utils/time'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda'

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
}: {
  event: IEventModel
  session: ISessionModel
  showTime?: boolean
  speakers?: boolean
}) => {
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now()

  console.log('session', session)
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="border-none">
          <CardHeader>
            <CardTitle>{session.name}</CardTitle>
            <CardDescription>
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
          <CardContent>
            {speakers && (
              <div className="flex py-1 items-center flex-row space-x-2 overflow-x-scroll mt-auto">
                {session.speakers.map((speaker) => (
                  <Badge
                    key={speaker.name}
                    variant={'outline'}
                    className="text-white">
                    {speaker.name}
                  </Badge>
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
