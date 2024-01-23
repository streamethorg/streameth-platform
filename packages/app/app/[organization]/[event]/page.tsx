import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import SpeakerComponent from './speakers/components/SpeakerComponent'
import ScheduleComponent from './schedule/components/ScheduleComponent'
import Image from 'next/image'
import { getEventPeriod } from '@/lib/utils/time'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchEvent, fetchEventStages, fetchEvents } from '@/lib/data'
import { EventPageProps } from '@/lib/types'
import { ResolvingMetadata, Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import StagePreview from './stage/components/StagePreview'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export async function generateStaticParams() {
  const allEvents = await fetchEvents({})
  const paths = allEvents.map((event) => ({
    organization: event.organizationId,
    event: event._id,
  }))
  return paths
}

export default async function EventHome({
  params,
  searchParams,
}: EventPageProps) {
  console.log('params', params.event)
  const event = await fetchEvent({
    eventSlug: params.event,
  })

  if (!event) return notFound()

  const stages = await fetchEventStages({
    eventId: event.id,
  })

  return (
    <div className="flex flex-col w-full h-full bg-accent px-2">
      <div className=" relative space-y-4 lg:my-4 max-w-full lg:max-w-4xl mx-auto z-50">
        <Card className="border-none">
          <AspectRatio ratio={3 / 1}>
            <Image
              className="rounded-lg max-h-[500px] p-2"
              src={event.banner}
              alt="Event Cover"
              width={1500}
              height={500}
              style={{
                objectFit: 'cover',
              }}
            />
          </AspectRatio>
          <CardHeader>
            <CardTitle className="text-4xl uppercase">
              {event.name}
            </CardTitle>
            <CardDescription>
              <p>
                <span className="mr-2">&#128197;</span>
                {new Date(event.start).toDateString()}
                {new Date(event?.start).toDateString() !==
                new Date(event?.end).toDateString()
                  ? ` - ${new Date(event.end).toDateString()}`
                  : ''}
              </p>
              <p>
                <span className="mr-2">&#9200;</span>
                {event?.startTime
                  ? `${getEventPeriod(event.startTime)} - ${
                      event.endTime
                        ? getEventPeriod(event.endTime)
                        : ''
                    } ${event.timezone}`
                  : 'TBD'}
              </p>
              <p>
                <span className="mr-2">&#127759;</span>
                {event.location}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Markdown remarkPlugins={[remarkGfm]}>
              {event.description}
            </Markdown>
          </CardContent>
        </Card>
        <Suspense>
          <Card className="border-none ">
            <CardHeader>
              <CardTitle className="text-4xl uppercase">
                Livestreams
              </CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-4">
              {stages?.map((stage) => (
                <StagePreview
                  key={stage.id}
                  event={event.id}
                  organization={params.organizationSlug}
                  stage={stage}
                />
              ))}
            </CardContent>
          </Card>
        </Suspense>
        <Suspense>
          <ScheduleComponent
            stages={stages}
            event={event}
            stage={searchParams.stage}
            date={searchParams.date}
          />
        </Suspense>
        <Suspense>
          <SpeakerComponent event={event} />
        </Suspense>
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: EventPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { eventSlug } = params
  const eventInfo = await fetchEvent({
    eventSlug,
  })

  if (!eventInfo) {
    return {
      title: 'StreamETH Event',
    }
  }

  const imageUrl = eventInfo.eventCover
  try {
    return {
      title: eventInfo.name,
      description: eventInfo.description,
      openGraph: {
        title: eventInfo.name,
        description: eventInfo.description,
        images: [imageUrl!],
      },
      twitter: {
        card: 'summary_large_image',
        title: eventInfo.name,
        description: eventInfo.description,
        images: {
          url: imageUrl!,
          alt: eventInfo.name + ' Logo',
        },
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'StreamETH Event',
    }
  }
}
