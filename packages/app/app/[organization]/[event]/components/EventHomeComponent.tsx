import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import StagePreview from '../stage/components/StagePreview'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'

import SpeakerComponent, {
  SpeakerComponentSkeleton,
} from '../speakers/components/SpeakerComponent'
import ScheduleComponent, {
  ScheduleSkeleton,
} from '../schedule/components/ScheduleComponent'
import Image from 'next/image'
import {
  getEventPeriod,
  extractDate,
  isSameDate,
} from '@/lib/utils/time'
import Markdown from 'react-markdown'
import { Suspense } from 'react'
import banner from '@/public/streameth_twitter_banner.jpeg'
import { IExtendedEvent } from '@/lib/types'
import SignUp from '@/components/plugins/SignUp'
import MDEditor from '@uiw/react-md-editor'
import MarkdownDisplay from '@/components/misc/MarkdownDisplay'
export default function EventHomeComponent({
  event,
  stages,
  params,
  searchParams,
}: {
  event: IExtendedEvent
  stages: IStageModel[]

  params: {
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}) {
  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties
  const bannerImg = event.banner !== '' ? event.banner : banner
  return (
    <div
      className="flex flex-col w-full bg-event px-2"
      style={{ ...style }}>
      <div className="w-full relative space-y-4 lg:my-4 max-w-full lg:max-w-4xl mx-auto z-50">
        <Card className="text-white bg-opacity-[0.04] bg-white border-white border-opacity-[0.04] lg:rounded-xl shadow">
          <AspectRatio
            ratio={3 / 1}
            className="overflow-clip rounded-xl p-2">
            <Image
              className="rounded-lg object-contain h-full"
              src={bannerImg!}
              alt="Event Cover"
              width={1500}
              height={500}
              style={{
                objectFit: 'cover',
              }}
            />
          </AspectRatio>
          <CardHeader>
            <div className="flex flex-col md:flex-row w-full my-2 gap-2">
              <CardTitle className="py-2 text-4xl uppercase text-white">
                {event.name}
              </CardTitle>
              {event.dataImporter?.[0]?.config?.sheetId && (
                <SignUp event={event} />
              )}
            </div>
            <div className="text-sm text-white">
              <p>
                <span className="mr-2">&#128197;</span>
                {extractDate(new Date(event.start))}
                {!isSameDate(
                  new Date(event.start),
                  new Date(event.end)
                )
                  ? ` - ${extractDate(new Date(event.end))}`
                  : ''}
              </p>
              <p>
                <span className="mr-2">&#9200;</span>
                <span className="capitalize">
                  {event?.startTime
                    ? `${event.startTime?.replace(
                        /\s?[AP]M/g,
                        ''
                      )} - ${
                        event.endTime
                          ? event.endTime?.replace(/\s?[AP]M/g, '')
                          : ''
                      } ${event.timezone}`
                    : 'TBD'}
                </span>
              </p>

              <p>
                <span className="mr-2">&#127759;</span>
                {event.location}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0 lg:pt-0 text-white">
            <MarkdownDisplay content={event.description} />
          </CardContent>
          <CardFooter className="flex flex-col p-4 space-y-2 w-full items-start">
            <CardTitle className=" text-white">Livestreams</CardTitle>
            <div className="w-full grid lg:grid-cols-2 gap-4 pt-0 lg:pt-0">
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
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleComponent
            stages={stages}
            event={event}
            stage={searchParams.stage}
            date={searchParams.date}
          />
        </Suspense>
        <Suspense fallback={<SpeakerComponentSkeleton />}>
          <SpeakerComponent event={event} />
        </Suspense>
      </div>
    </div>
  )
}
