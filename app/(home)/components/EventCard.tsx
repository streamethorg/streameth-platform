'use client'
import { useState, useContext } from 'react'
import { IEvent } from '@/server/model/event'
import Image from 'next/image'
import Cover from '@/public/cover.png'
import Card from '@/components/misc/Card'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'
import { hasData } from '@/server/utils'

const EventCard = ({ event }: { event: IEvent }) => {
  const imageUrl = event.eventCover
    ? event.eventCover
    : event.id + '.png'
  const [image, setImage] = useState('/events/' + imageUrl)
  const { openModal } = useContext(ModalContext)
  const router = useRouter()
  const isAvailable = hasData({ event })

  const onCardClick = () => {
    if (isAvailable) {
      router.push(`${event.organizationId}/${event.id}`)
    } else {
      openModal(
        <div className="flex flex-col  items-center">
          <h1 className="text-2xl text-main-text font-bold">
            This event has no data yet
          </h1>
          <p className="text-secondary-text text-center">
            This event has no data. Please contact the event organizer
            to request access.
          </p>
        </div>
      )
    }
  }

  return (
    <div onClick={onCardClick} className="cursor-pointer">
      <Card isAvailable={isAvailable} bgColor="white">
        <div className="aspect-video relative">
          <Image
            className="rounded"
            alt="Session image"
            quality={80}
            src={image}
            fill
            style={{
              objectFit: 'cover',
            }}
            onError={() => {
              setImage(Cover.src)
            }}
            onLoadingComplete={(result) => {
              if (result.naturalHeight === 0) {
                setImage(Cover.src)
              }
            }}
          />
        </div>
        <div className="p-2 flex flex-col" title={event.name}>
          <p className="text-md text-blue font-semibold my-2 truncate">
            {event.name}
          </p>
          <p className="text-md  text-blue">
            {event.start.toDateString?.()} -{' '}
            {event.end.toDateString?.()}
          </p>
        </div>
      </Card>
    </div>
  )
}

export default EventCard
