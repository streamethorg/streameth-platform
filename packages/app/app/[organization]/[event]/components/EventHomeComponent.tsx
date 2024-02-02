import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import StagePreview from '../stage/components/StagePreview'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'

import SpeakerComponent from '../speakers/components/SpeakerComponent'
import ScheduleComponent from '../schedule/components/ScheduleComponent'
import Image from 'next/image'
import {
  getEventPeriod,
  extractDate,
  isSameDate,
} from '@/lib/utils/time'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Suspense } from 'react'
import banner from '@/public/streameth_twitter_banner.jpeg'
export default function EventHomeComponent({
  event,
  stages,
  params,
  searchParams,
}: {
  event: IEventModel
  stages: IStageModel[]

  params: {
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}) {
  const bannerImg = event.banner !== '' ? event.banner : banner
  return (
    <div className="flex flex-col w-full h-full bg-event px-2">
      <div className=" relative space-y-4 lg:my-4 max-w-full lg:max-w-4xl mx-auto z-50">
        <Card className="text-white bg-opacity-[0.04] bg-white border-white border-opacity-[0.04] lg:rounded-xl shadow">
          <AspectRatio ratio={3 / 1}>
            <Image
              className="rounded-lg  p-2"
              src={bannerImg}
              alt="Event Cover"
              width={1500}
              height={500}
              style={{
                objectFit: 'cover',
              }}
            />
          </AspectRatio>
          <CardHeader>
            <CardTitle className="py-2 text-4xl uppercase text-white">
              {event.name}
            </CardTitle>
            <div className="text-sm text-white">
              <p>
                <span className="mr-2">&#128197;</span>
                {extractDate(event.start)}
                {!isSameDate(event.start, event.end)
                  ? ` - ${extractDate(event.end)}`
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
            </div>
          </CardHeader>
          <CardContent className="pt-0 lg:pt-0 text-white">
            <Markdown remarkPlugins={[remarkGfm]}>
              {event.description}
            </Markdown>
          </CardContent>
          <CardFooter className="flex flex-col p-4 space-y-2 w-full items-start">
            <CardTitle className=" text-white">Livestreams</CardTitle>
            <div className="grid lg:grid-cols-2 gap-4 pt-0 lg:pt-0">
              {stages?.map((stage) => (
                <StagePreview
                  key={stage._id}
                  event={event._id}
                  organization={params.organization}
                  stage={stage}
                  eventCover={event?.eventCover}
                />
              ))}
            </div>
          </CardFooter>
        </Card>
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
