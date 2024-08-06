import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { IExtendedEvent, IExtendedOrganization } from '@/lib/types';

interface FeaturedEventsProps {
  events: IExtendedEvent[];
  organizations: { [key: string]: IExtendedOrganization };
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  organizations,
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => {
        const org = organizations[event.organizationId];
        const eventUrl = `https://streameth.org/${org.slug}`;

        return (
          <Link
            href={eventUrl}
            key={event._id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              className="relative flex h-full flex-col overflow-hidden duration-300 ease-out hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="flex-shrink-0 p-0 md:p-0 lg:p-0">
                <Image
                  src={
                    event.eventCover || 'https://via.placeholder.com/300x200'
                  }
                  className="aspect-video w-full"
                  alt={event.name}
                  width={300}
                  height={200}
                />
              </CardHeader>
              <div className="absolute bottom-0">
                <CardContent className="flex flex-grow flex-col p-5">
                  <CardTitle className="mb-2 line-clamp-2 text-xl font-bold">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="mb-2">
                    {new Date(event.start).toLocaleDateString()} -{' '}
                    {new Date(event.end).toLocaleDateString()}
                  </CardDescription>
                  <CardDescription className="mb-2">
                    {event.location}
                  </CardDescription>
                  {org && (
                    <CardDescription className="mb-2">
                      Organized by: {org.name}
                    </CardDescription>
                  )}
                  <CardDescription className="mt-auto line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardContent>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedEvents;
