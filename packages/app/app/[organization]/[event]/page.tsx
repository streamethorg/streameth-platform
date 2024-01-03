import { notFound } from 'next/navigation'
import SpeakerComponent from './speakers/components/SpeakerComponent'
import ScheduleComponent from './schedule/components/ScheduleComponent'
import Image from 'next/image'
import { getEventPeriod } from '@/lib/utils/time'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchEvent, fetchEventStages, fetchEvents } from '@/lib/data'
import { getImageUrl } from '@/lib/utils'
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
import { Suspense } from 'react'

export async function generateStaticParams() {
  const allEvents = await fetchEvents({})
  const paths = allEvents.map((event) => ({
    organization: event.organizationId,
    event: event.id,
  }))
  return paths
}

interface Params {
  params: {
    event: string
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}

export default async function EventHome({
  params,
  searchParams,
}: Params) {
  const event = await fetchEvent({
    event: params.event,
    organization: params.organization,
  })

  const stages = await fetchEventStages({
    event: params.event,
  })

  if (!event) return notFound()

  return (
    <div className="flex flex-col w-full h-full bg-accent px-2">
      <div className=" relative space-y-4 md:my-4 max-w-full md:max-w-4xl mx-auto z-50">
        <Card className="border-none">
          <AspectRatio ratio={3 / 1}>
            <Image
              className="rounded-lg max-h-[500px] p-2"
              src={getImageUrl('/events/' + event.banner)}
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
            <CardContent className="grid md:grid-cols-2 gap-4">
              {stages.map((stage) => (
                <StagePreview
                  key={stage.id}
                  event={event.id}
                  organization={params.organization}
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
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { organization, event } = params
  const eventInfo = await fetchEvent({
    event,
    organization,
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
        images: [getImageUrl(`/events/${imageUrl!}`)],
      },
      twitter: {
        card: 'summary_large_image',
        title: eventInfo.name,
        description: eventInfo.description,
        images: {
          url: getImageUrl(`/events/${imageUrl!}`),
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
