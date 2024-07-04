import React from 'react';
import EventTable from './components/EventTable';
import { studioPageParams } from '@/lib/types';
import { fetchEvents } from '@/lib/services/eventService';

const Events = async ({ params }: studioPageParams) => {
  // const events = await fetchEvents({
  //   organizationSlug: params.organization,
  // })

  return (
    <></>
    // <EventTable organization={params.organization} events={events} />
  );
};

export default Events;
