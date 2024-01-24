import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSessions, fetchEvents } from '@/lib/data'
import { diceCoefficient } from 'dice-coefficient'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const events = await fetchEvents({})

  const sessions = (
    await fetchAllSessions({
      event: searchParams.get('event') || undefined,
      organizationSlug: searchParams.get('organization') || undefined,
      searchQuery: searchParams.get('searchQuery') || undefined,
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
    sessions: searchResults.map((session) => session.name),
    events: eventResults.map((event) => ({
      id: event.id,
      name: event.name,
    })),
  }

  return NextResponse.json(returnData)
}
