'use client'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface Event {
  _id: string
  name: string
  description: string
  start: string
  end: string
  logo: string
  eventCover: string
  location: string
  slug: string
  website: string
  organizationId: string
}

interface Organization {
  _id: string
  name: string
  slug: string
}

const FeaturedEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [organizations, setOrganizations] = useState<{
    [key: string]: Organization
  }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, orgsResponse] = await Promise.all([
          fetch('https://api.streameth.org/events'),
          fetch('https://api.streameth.org/organizations'),
        ])

        if (!eventsResponse.ok || !orgsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const eventsData = await eventsResponse.json()
        const orgsData = await orgsResponse.json()

        const sortedEvents = eventsData.data
          .sort(
            (a: Event, b: Event) =>
              new Date(b.start).getTime() -
              new Date(a.start).getTime()
          )
          .slice(0, 4)

        const orgsMap = orgsData.data.reduce(
          (
            acc: { [key: string]: Organization },
            org: Organization
          ) => {
            acc[org._id] = org
            return acc
          },
          {}
        )

        setEvents(sortedEvents)
        setOrganizations(orgsMap)
      } catch (err) {
        setError('Error fetching data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((event, index) => {
        const org = organizations[event.organizationId]
        const eventUrl =
          event.website ||
          `https://streameth.org/${org?.slug || event.slug}`

        return (
          <Link
            href={eventUrl}
            key={event._id}
            target="_blank"
            rel="noopener noreferrer">
            <Card
              className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-out animate-in fade-in zoom-in hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}>
              <CardHeader className="flex-shrink-0 p-0">
                <img
                  src={
                    event.eventCover ||
                    event.logo ||
                    'https://via.placeholder.com/300x200'
                  }
                  alt={event.name}
                  className="h-48 w-full object-cover"
                />
              </CardHeader>
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
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export default FeaturedEvents
