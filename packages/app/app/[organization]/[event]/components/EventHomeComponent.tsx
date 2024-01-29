import {
  Card,
  CardContent,
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
            <div className="text-sm text-muted-foreground">
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
                  key={stage._id}
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
