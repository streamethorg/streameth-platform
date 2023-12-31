'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment-timezone'
import { ISession } from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'
import { getEventTimezoneText } from '@/lib/utils/time'
import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaFooter,
  CredenzaBody,
} from '@/components/ui/crezenda'
import SpeakerIcon from '@/components/speakers/speakerIcon'
import { Button } from '@/components/ui/button'

const ScheduleCardModal = ({
  event,
  session,
}: {
  event: IEvent
  session: ISession
}) => {
  const [showGoToStage, setShowGoToStage] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const paramsOrgId = pathname.split('/')[1]
  useEffect(() => {
    const url = window.location.href
    setShowGoToStage(!url.includes('/stage'))
  }, [])

  const handleGoToStage = () => {
    const stageUrl = `/${paramsOrgId}/${session.eventId}/stage/${session.stageId}`
    !pathname.includes('schedule')
      ? router.push(stageUrl)
      : window.open(stageUrl, '_blank', 'noreferrer')
  }

  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle>{session.name}</CredenzaTitle>
        <CredenzaDescription>
          {new Date(session.start).toDateString()}{' '}
          {moment(session.start)
            .tz(event?.timezone)
            .format('HH:mm')}{' '}
          -{' '}
          {moment(session.end)
            .tz(event?.timezone)
            .format('HH:mm')}{' '}
          {getEventTimezoneText(event?.timezone)}
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        {session.description && <p>{session.description}</p>}
        <p className="flex flex-row flex-wrap mt-3">
          {session.speakers.map((speaker) => (
            <SpeakerIcon key={speaker.id} speaker={speaker} />
          ))}
        </p>
      </CredenzaBody>
      {showGoToStage && (
        <CredenzaFooter>
          <Button onClick={handleGoToStage}>Go to Stream</Button>
        </CredenzaFooter>
      )}
    </CredenzaContent>
  )
}

export default ScheduleCardModal
