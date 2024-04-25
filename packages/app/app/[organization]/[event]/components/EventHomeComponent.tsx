import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import StagePreview from '../stage/components/StagePreview'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import SpeakerComponent, {
  SpeakerComponentSkeleton,
} from '../speakers/components/SpeakerComponent'
import ScheduleComponent, {
  ScheduleSkeleton,
} from '../schedule/components/ScheduleComponent'
import Image from 'next/image'
import { formatDate, isSameDate } from '@/lib/utils/time'
import { Suspense } from 'react'
import banner from '@/public/streameth_twitter_banner.jpeg'
import { IExtendedEvent, IExtendedStage } from '@/lib/types'
import SignUp from '@/components/plugins/SignUp'
import MarkdownDisplay from '@/components/misc/MarkdownDisplay'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import StageComponent from '../stage/components/StageComponent'

export default function EventHomeComponent({
  event,
  stages,
  params,
  searchParams,
}: {
  event: IExtendedEvent
  stages: IExtendedStage[]

  params: {
    organization: string
  }
  searchParams: {
    stage?: string
    date?: string
    livestream?: string
  }
}) {
  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties
  const bannerImg = event.banner !== '' ? event.banner : banner
  return (
    <div
      className="flex flex-col w-full bg-background px-2"
      style={{ ...style }}>
      <div className="w-full relative space-y-4 lg:my-4 max-w-full lg:max-w-5xl mx-auto z-50">
        {!searchParams.livestream ? (
          <Card className="bg-white shadow-none lg:rounded-xl border">
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
            <CardHeader className="flex flex-row items-start">
              <div className="flex flex-col w-full my-2 gap-2 justify-start items-start">
                <CardTitle className=" text-4xl uppercase">
                  {event.name}
                </CardTitle>
                {event.dataImporter?.[0]?.config?.sheetId && (
                  <SignUp event={event} />
                )}
              </div>
              <div className="lg:min-w-[300px] text-sm space-y-2">
                <p>
                  <span className="mr-2">&#128197;</span>
                  {formatDate(new Date(event.start))}
                  {!isSameDate(
                    new Date(event.start),
                    new Date(event.end)
                  )
                    ? ` - ${formatDate(new Date(event.end))}`
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
          </Card>
        ) : (
          <StageComponent
            event={event}
            stageId={searchParams.livestream}
          />
        )}
        <Tabs
          defaultValue="schedule"
          className="bg-white rounded-xl border p-2">
          <TabsList className="bg-white w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
          </TabsList>
          <TabsContent className="p-2" value="about">
            <MarkdownDisplay content={event.description} />
          </TabsContent>
          <TabsContent value="livestreams">
            <div className="w-full grid lg:grid-cols-2 gap-4">
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
          </TabsContent>

          <TabsContent value="schedule" className="h-full">
            <Suspense fallback={<ScheduleSkeleton />}>
              <ScheduleComponent
                stages={stages}
                event={event}
                stage={searchParams.stage}
                date={searchParams.date}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="speakers">
            <Suspense fallback={<SpeakerComponentSkeleton />}>
              <SpeakerComponent event={event} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
