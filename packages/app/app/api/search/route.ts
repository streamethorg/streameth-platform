import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSessions } from '@/lib/data'
import { diceCoefficient } from 'dice-coefficient'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessions = (
    await fetchAllSessions({
      event: searchParams.get('event') || undefined,
      organization: searchParams.get('organization') || undefined,
      searchQuery: searchParams.get('searchQuery') || undefined,
    })
  ).sessions

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

  const returnData = searchResults.map((session) => session.name)

  return NextResponse.json(returnData)
}
