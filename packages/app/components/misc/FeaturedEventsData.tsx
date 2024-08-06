import { cache } from 'react';

interface Event {
  _id: string;
  name: string;
  description: string;
  start: string;
  end: string;
  logo: string;
  eventCover: string;
  location: string;
  slug: string;
  website: string;
  organizationId: string;
}

interface Organization {
  _id: string;
  name: string;
  slug: string;
}

const fetchEvents = cache(async () => {
  const response = await fetch('https://api.streameth.org/events', {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json();
  console.log(data);
  return data.data
    .sort(
      (a: Event, b: Event) =>
        new Date(b.start).getTime() - new Date(a.start).getTime()
    )
    .slice(0, 4);
});

const fetchOrganizations = cache(async () => {
  const response = await fetch('https://api.streameth.org/organizations', {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  const data = await response.json();
  return data.data.reduce(
    (acc: { [key: string]: Organization }, org: Organization) => {
      acc[org._id] = org;
      return acc;
    },
    {}
  );
});

export async function getFeaturedEventsData() {
  const [events, organizations] = await Promise.all([
    fetchEvents(),
    fetchOrganizations(),
  ]);

  return { events, organizations };
}
