import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import EventController from '@/server/controller/event'
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  await writeFile(`./public/events/${file.name}`, buffer)

  return NextResponse.json({ success: true })
}
