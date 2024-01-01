'use client'

import { ModalContext } from '@/context/ModalContext'
import { useContext } from 'react'
import ScheduleCardModal from './ScheduleCardModal'
import moment from 'moment-timezone'
import { ISession } from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'
import { getEventTimezoneText } from '@/utils/time'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
}: {
  event: IEvent
  session: ISession
  showTime?: boolean
  speakers?: boolean
}) => {
  const { openModal } = useContext(ModalContext)
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now()

  return (
    <Card
      className="border-none"
      onClick={() => {
        openModal(
          <ScheduleCardModal event={event} session={session} />
        )
      }}>
      <CardHeader>
        <CardTitle>{session.name}</CardTitle>
        <CardDescription>
          {showTime && (
            <>
              {moment(session.start)
                .tz(event?.timezone)
                .format('HH:mm')}{' '}
              -{' '}
              {moment(session.end)
                .tz(event?.timezone)
                .format('HH:mm')}{' '}
              {getEventTimezoneText(event?.timezone)}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {speakers && (
          <div className="flex py-1 items-center flex-row space-x-2 overflow-x-scroll mt-auto">
            {session.speakers.map((speaker) => (
              <Badge
                key={speaker.id}
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
  )
}

export default ScheduleCard
