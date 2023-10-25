import GoogleSheetService from '@/server/services/googleSheet'
import { NextResponse } from 'next/server'
import EventController from '@/server/controller/event';
export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { id: string; eventId: string }
  }
) {
  if (request.method !== 'POST') {
    return NextResponse.next()
  }

  const { email } = await request.json()

  if (!email || !params.eventId) {
    // return 401
    return NextResponse.json({ error: 'Missing email or eventId' }, { status: 401 })
  }
  const eventController = new EventController()
  const event = await eventController.getEvent(params.eventId, params.id)

  if (!event.dataImporter || event.dataImporter.length === 0 || event.dataImporter[0].type !== 'gsheet') {
    // return 401
    return NextResponse.json({ error: 'Missing data importer' }, { status: 401 })
  }

  try {
    
    const googleSheetService = new GoogleSheetService(event.dataImporter[0].config.sheetId)
    await googleSheetService.appendData('test', [[email, params.eventId]])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error appending data:', error)
    return NextResponse.json({ error: 'Error appending data' }, { status: 500 })
  }
}
