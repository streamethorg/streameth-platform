import {
  S3,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  ListBucketsCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

class S3Service {
  private s3Client: S3

  constructor() {
    this.s3Client = new S3({
      endpoint: 'https://ams3.digitaloceanspaces.com',
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.SPACES_KEY ?? '',
        secretAccessKey: process.env.SPACES_SECRET ?? '',
      },
    })
  }

  async uploadFile(
    bucketName: string,
    key: string,
    file: Buffer | Readable,
    contentType: string
  ): Promise<void> {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(params)
    await this.s3Client.send(command)
    console.log('Uploaded file...')
  }

  async listBuckets() {
    const command = new ListBucketsCommand({})
    const { Buckets } = await this.s3Client.send(command)

    return Buckets
  }

  async getBucket(bucketName: string, path?: string) {
    const params = {
      Bucket: bucketName,
    }

    const command = new ListObjectsCommand(params)
    const data = await this.s3Client.send(command)

    if (path && data.Contents) {
      const objectsWithPath = data.Contents.filter((object) =>
        object.Key!.includes(path)
      )
      return objectsWithPath
    }

    return data
  }

  async getObject(
    bucketName: string,
    key: string
  ): Promise<string | null> {
    const params = {
      Bucket: bucketName,
      Key: key,
    }

    const getObjectCommand = new GetObjectCommand(params)
    try {
      const response = await this.s3Client.send(getObjectCommand)

      return response.Body!.transformToString()
    } catch (err) {
      console.log('Could not find object')
      return null
    }
  }
}

export default S3Service
