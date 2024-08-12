import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

const FeaturedEvents = ({
  events,
}: {
  events: {
    name: string;
    url: string;
    cover: string;
    organization: string;
  }[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => {
        return (
          <Link
            href={event.url}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card
              className="relative flex h-full flex-col overflow-hidden duration-300 ease-out hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="flex-shrink-0 p-0 md:p-0 lg:p-0">
                <Image
                  src={event.cover}
                  className="aspect-video w-full"
                  alt={event.name}
                  width={300}
                  height={200}
                />
              </CardHeader>
              {/* <div className="absolute bottom-0 bg-black bg-opacity-80 w-full text-white">
                <CardContent className="flex flex-grow flex-col p-5">
                  <CardTitle className="mb-2 line-clamp-2 text-xl font-bold">
                    {event.name}
                  </CardTitle>
                    <CardDescription className="mb-2">
                      Organized by: {event.organization}
                    </CardDescription>
                </CardContent>
              </div> */}
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedEvents;
