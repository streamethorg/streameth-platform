import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Play, Users, Calendar } from 'lucide-react';

const FeaturedEvents = ({
  events,
}: {
  events: {
    name: string;
    url: string;
    cover: string;
    organization: string;
    viewers?: string;
    date?: string;
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
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] bg-white"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="flex-shrink-0 p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={event.cover}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={event.name}
                    width={400}
                    height={225}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-grow flex-col p-6">
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {event.organization}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {event.name}
                </h3>

                <div className="mt-auto space-y-2">
                  {event.viewers && event.date && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{event.viewers} viewers</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300 group-hover:w-full"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedEvents;
