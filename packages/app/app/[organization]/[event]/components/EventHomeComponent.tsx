import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import StagePreview from '../stage/components/StagePreview';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SpeakerComponent, {
  SpeakerComponentSkeleton,
} from '../speakers/components/SpeakerComponent';
import ScheduleComponent, {
  ScheduleSkeleton,
} from '../schedule/components/ScheduleComponent';
import Image from 'next/image';
import { formatDate, isSameDate } from '@/lib/utils/time';
import { Suspense } from 'react';
import banner from '@/public/streameth_twitter_banner.jpeg';
import { IExtendedEvent, IExtendedStage } from '@/lib/types';
import SignUp from '@/components/plugins/SignUp';
import MarkdownDisplay from '@/components/misc/MarkdownDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StageComponent from '../stage/components/StageComponent';

export default function EventHomeComponent({
  event,
  stages,
  params,
  searchParams,
}: {
  event: IExtendedEvent;
  stages: IExtendedStage[];

  params: {
    organization: string;
  };
  searchParams: {
    stage?: string;
    date?: string;
    livestream?: string;
  };
}) {
  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties;
  const bannerImg = event.banner !== '' ? event.banner : banner;
  return (
    <div
      className="flex w-full flex-col bg-background px-2"
      style={{ ...style }}
    >
      <div className="relative z-50 mx-auto w-full max-w-full space-y-4 lg:my-4 lg:max-w-5xl">
        {!searchParams.livestream ? (
          <Card className="border bg-white shadow-none lg:rounded-xl">
            <AspectRatio ratio={3 / 1} className="overflow-clip rounded-xl p-2">
              <Image
                className="h-full rounded-lg object-contain"
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
              <div className="my-2 flex w-full flex-col items-start justify-start gap-2">
                <CardTitle className="text-4xl uppercase">
                  {event.name}
                </CardTitle>
                {event.dataImporter?.[0]?.config?.sheetId && (
                  <SignUp event={event} />
                )}
              </div>
              <div className="space-y-2 text-sm lg:min-w-[300px]">
                <p>
                  <span className="mr-2">&#128197;</span>
                  {formatDate(new Date(event.start))}
                  {!isSameDate(new Date(event.start), new Date(event.end))
                    ? ` - ${formatDate(new Date(event.end))}`
                    : ''}
                </p>
                <p>
                  <span className="mr-2">&#9200;</span>
                  <span className="capitalize">
                    {event?.startTime
                      ? `${event.startTime?.replace(/\s?[AP]M/g, '')} - ${
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
          <StageComponent event={event} stageId={searchParams.livestream} />
        )}
        <Tabs
          defaultValue="schedule"
          className="rounded-xl border bg-white p-2"
        >
          <TabsList className="w-full justify-start bg-white">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
          </TabsList>
          <TabsContent className="p-2" value="about">
            <MarkdownDisplay content={event.description} />
          </TabsContent>
          <TabsContent value="livestreams">
            <div className="grid w-full gap-4 lg:grid-cols-2">
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
  );
}
