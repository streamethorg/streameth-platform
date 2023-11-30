import { NextRequest, NextResponse } from 'next/server'
import S3Service from 'streameth-server/services/s3'
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const s3 = new S3Service()
  const result = await s3.uploadFile(
    'streamethapp',
    `events/${params.id}/${file.name}`,
    buffer,
    file.type
  )

  return NextResponse.json({ success: true, result })
}
