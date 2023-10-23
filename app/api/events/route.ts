import { NextResponse } from 'next/server'
import EventController from '@/server/controller/event'

export async function GET(): Promise<NextResponse> {
  const controller = new EventController()
  const data = await controller.getAllEvents({})

  return NextResponse.json(data)
}
