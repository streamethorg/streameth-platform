'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import moment from 'moment-timezone'
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
import { IExtendedEvent, IExtendedSession } from '@/lib/types'

const ScheduleCardModal = ({
  organizationSlug,
  event,
  session,
}: {
  organizationSlug: string
  event: IExtendedEvent
  session: IExtendedSession
}) => {
  const [showGoToStage, setShowGoToStage] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const url = window.location.href
    setShowGoToStage(!url.includes('/stage'))
  }, [])

  const handleGoToStage = () => {
    router.push(
      `/${event.organizationId}/watch?session=${session._id}`
    )
  }

  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle>{session.name}</CredenzaTitle>
        <CredenzaDescription>
          {new Date(session.start).toDateString()}{' '}
          {moment(session.start).tz(event?.timezone).format('HH:mm')}{' '}
          - {moment(session.end).tz(event?.timezone).format('HH:mm')}{' '}
          ({getEventTimezoneText(event?.timezone)})
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody>
        {session.description && <p>{session.description}</p>}
        {session.speakers && (
          <p className="mt-3 flex flex-row flex-wrap">
            {session.speakers.map((speaker) => (
              <SpeakerIcon key={speaker?._id} speaker={speaker} />
            ))}
          </p>
        )}
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
