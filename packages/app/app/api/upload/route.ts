import { NextRequest, NextResponse } from 'next/server'
import S3Service from '@/lib/services/spacesService'
import { validateEnv } from '@/lib/utils/utils'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const path = data.get('path') as string
  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const s3 = new S3Service()
  const result = await s3.uploadFile(
    validateEnv('SPACE_STORAGE_PATH'),
    path + '/' + file.name,
    buffer,
    file.type
  )


  return NextResponse.json({
    success: true,
  })
}
