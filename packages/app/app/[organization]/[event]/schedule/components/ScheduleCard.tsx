'use client'
import ScheduleCardModal from './ScheduleCardModal'
import moment from 'moment-timezone'
import { getEventTimezoneText } from '@/lib/utils/time'
import { ClockIcon, WavesIcon } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda'
import { IExtendedEvent, IExtendedSession } from '@/lib/types'
import { Button } from '@/components/ui/button'

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
  date,
}: {
  event: IExtendedEvent
  session: IExtendedSession
  showTime?: boolean
  speakers?: boolean
  date?: string
}) => {
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now()

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card className="flex flex-col shadow-none hover:bg-secondary hover:border-primary">
          <CardHeader>
            <CardTitle className="text-lg">{session.name}</CardTitle>
            <CardDescription className="flex flex-row justify-start items-center space-x-2">
              {showTime && (
                <>
                  <ClockIcon className="w-4 h-4" />
                  <p>
                    {moment(session.start)
                      .tz(event.timezone || 'UTC')
                      .format('HH:mm')}{' '}
                    -{' '}
                    {moment(session.end)
                      .tz(event?.timezone || 'UTC')
                      .format('HH:mm')}
                    {' | '}
                    {getEventTimezoneText(event?.timezone || 'UTC')}
                  </p>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            {isActive && (
              <p className="text-bold text-red-500 ml-auto animate-pulse">
                Live
              </p>
            )}
            <Button variant={'secondary'}>
              <WavesIcon className="w-4 h-4 mr-2" /> Watch
            </Button>
          </CardFooter>
        </Card>
      </CredenzaTrigger>
      {/* <ScheduleCardModal event={event} session={session} /> */}
    </Credenza>
  )
}

export default ScheduleCard
