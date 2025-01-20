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
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      region: 'us-east-1',
      credentials: {
        accessKeyId: apiKey,
        secretAccessKey: secretKey,
      },
    });
    console.log('🔌 S3 client initialized with endpoint:', 'https://ams3.digitaloceanspaces.com');
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
      fileSize: file instanceof Buffer ? `${(file.length / 1024 / 1024).toFixed(2)}MB` : 'Stream',
      isStream: file instanceof Readable
    });

    const params: PutObjectCommandInput = {
      Bucket: name,
      Key: filename,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    };
    try {
      const environment = process.env.NODE_ENV;
      console.log(`🌍 Current environment: ${environment}`);

      if (
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'staging'
      ) {
        console.log('🚀 Uploading to development bucket:', {
          bucket: name,
          key: filename,
          contentType
        });
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);
        const url = `https://streameth-develop.ams3.digitaloceanspaces.com/${filename}`;
        console.log('✅ Upload successful to development:', {
          url,
          bucket: name,
          key: filename,
          contentType
        });
        return url;
      } else {
        console.log('🚀 Uploading to production bucket:', {
          bucket: name,
          key: filename,
          contentType
        });
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);
        const url = `https://streameth-production.ams3.digitaloceanspaces.com/${filename}`;
        console.log('✅ Upload successful to production:', {
          url,
          bucket: name,
          key: filename,
          contentType
        });
        return url;
      }
    } catch (error) {
      console.error('❌ S3 upload failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        bucket: name,
        key: filename,
        contentType
      });
      throw error;
    }
  }

  async listBuckets() {
    console.log('📋 Listing S3 buckets...');
    try {
      const command = new ListBucketsCommand({});
      const { Buckets } = await this.s3Client.send(command);
      console.log('✅ Successfully retrieved bucket list:', {
        count: Buckets?.length || 0,
        buckets: Buckets?.map(b => b.Name)
      });
      return Buckets;
    } catch (error) {
      console.error('❌ Failed to list buckets:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async getObject(key: string): Promise<string | null> {
    console.log('🔍 Attempting to retrieve object:', {
      bucket: name,
      key
    });
    
    const params = {
      Bucket: name,
      Key: key,
    };

    const getObjectCommand = new GetObjectCommand(params);
    try {
      const response = await this.s3Client.send(getObjectCommand);
      console.log('✅ Successfully retrieved object:', {
        bucket: name,
        key,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified
      });
      return response.Body!.transformToString();
    } catch (err) {
      console.error('❌ Failed to retrieve object:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        bucket: name,
        key
      });
      return null;
    }
  }
}
