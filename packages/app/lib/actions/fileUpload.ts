'use server'
import S3Service from '@/lib/services/spacesService'

export const uploadFile = async (data: FormData) => {
  const file = data.get('fileUpload')

  const s3 = new S3Service()
  // const result = await s3.uploadFile("bucketname",
}
