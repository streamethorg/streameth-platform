import {
  S3,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { config } from '@config';
const { name, apiKey, secretKey, host } = config.storage.s3;
import { Readable } from 'stream';

export default class StorageService {
  private s3Client: S3;

  constructor() {
    this.s3Client = new S3({
      endpoint: 'https://ams3.digitaloceanspaces.com',
      region: 'us-east-1',
      credentials: {
        accessKeyId: apiKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async uploadFile(
    filename: string,
    file: Buffer | Readable,
    contentType: string,
  ): Promise<string> {
    console.log('🔧 Configuring S3 upload:', {
      bucket: name,
      filename,
      contentType,
    });

    const params: PutObjectCommandInput = {
      Bucket: name,
      Key: filename,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    };
    try {
      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'staging'
      ) {
        console.log('🚀 Uploading to development bucket...');
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);
        const url = `https://streameth-develop.ams3.digitaloceanspaces.com/${filename}`;
        console.log('✅ Upload successful to development:', url);
        return url;
      } else {
        console.log('🚀 Uploading to production bucket...');
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);
        const url = `https://streameth-production.ams3.digitaloceanspaces.com/${filename}`;
        console.log('✅ Upload successful to production:', url);
        return url;
      }
    } catch (error) {
      console.error('❌ S3 upload failed:', error);
      throw error;
    }
  }

  async listBuckets() {
    const command = new ListBucketsCommand({});
    const { Buckets } = await this.s3Client.send(command);

    return Buckets;
  }

  async getObject(key: string): Promise<string | null> {
    const params = {
      Bucket: name,
      Key: key,
    };

    const getObjectCommand = new GetObjectCommand(params);
    try {
      const response = await this.s3Client.send(getObjectCommand);

      return response.Body!.transformToString();
    } catch (err) {
      console.log('Could not find object');
      return null;
    }
  }
}
