import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSessions } from '@/lib/data'
import { diceCoefficient } from 'dice-coefficient'
import { fetchEvents } from '@/lib/services/eventService'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  console.log(searchParams.get('searchQuery'), searchParams.get('organization'))
  const events = await fetchEvents({})
  const sessions = (
    await fetchAllSessions({
      event: searchParams.get('event') || undefined,
      organizationSlug: searchParams.get('organization') || undefined,
      searchQuery: searchParams.get('searchQuery') || undefined,
      onlyVideos: true,
      limit: 5,
    })
  ).sessions

  const eventResults = events
    .map((event) => {
      const score = diceCoefficient(
        searchParams.get('searchQuery') || '',
        event.name
      )
      return {
        ...event,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  const searchResults = sessions
    .map((session) => {
      const score = diceCoefficient(
        searchParams.get('searchQuery') || '',
        session.name
      )
      return {
        ...session,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const returnData = {
    sessions: searchResults.map((session) => ({
      id: session._id,
      name: session.name,
    })),
    events: eventResults.map((event) => ({
      id: event._id,
      name: event.name,
      slug: event.slug,
    })),
  }

  return NextResponse.json(returnData)
}
