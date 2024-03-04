'use server'
import S3Service from '@/lib/services/spacesService'

export async function upload(data: FormData) {
  'use server'

  const file: File | null = data.get('file') as unknown as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const s3 = new S3Service()
  const result = await s3.uploadFile(
    'bucketname',
    file.name,
    buffer,
    file.type
  )

  return { success: true }
}
