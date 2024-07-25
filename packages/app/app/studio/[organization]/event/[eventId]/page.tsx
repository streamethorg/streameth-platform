import React, { Suspense } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { studioPageParams } from '@/lib/types';
import { fetchEvent } from '@/lib/services/eventService';
import { fetchEventStages } from '@/lib/services/stageService';
import StreamConfig from './components/stageSettings/StageConfig';
import EventHomeComponent from '@/app/[organization]/[event]/components/EventHomeComponent';
import { notFound } from 'next/navigation';
import Navigation from './components/navigation';

export default async function EventPage({
  params,
  searchParams,
}: studioPageParams) {
  const { settings, stage: stageId } = searchParams;

  // const event = await fetchEvent({ eventId: params?.eventId })
  // if (!event) return notFound()

  // const stages = await fetchEventStages({
  //   eventId: event.slug,
  // })

  return (
    <></>
    // <div className="flex flex-row h-full overflow-hidden w-full">
    //   <TooltipProvider>
    //     <Navigation
    //       organizationSlug={params.organization}
    //       event={event}
    //       stages={stages}
    //       organizationId={params.organization}
    //     />
    //   </TooltipProvider>
    //   {settings !== 'stage' && (
    //     <div className="w-full h-full overflow-auto">
    //       <EventHomeComponent
    //         event={event}
    //         stages={stages}
    //         params={{
    //           organization: event.organizationId.toString(),
    //         }}
    //         searchParams={{
    //           stage: undefined,
    //           date: undefined,
    //         }}
    //       />
    //     </div>
    //   )}
    //   {settings === 'stage' && (
    //     <div className="w-full h-full">
    //       <div className="h-full overflow-auto">
    //         <StreamConfig
    //           organization={params.organization}
    //           stageId={stageId}
    //         />
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}
