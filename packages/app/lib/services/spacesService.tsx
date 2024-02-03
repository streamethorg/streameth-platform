import { S3 } from "aws-sdk";
import { Readable } from "stream";


class S3Service {
  private s3Client: S3;

  constructor() {
    this.s3Client = new S3({
      s3ForcePathStyle: false,
      endpoint: "https://ams3.digitaloceanspaces.com",
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_KEY ?? "",
        secretAccessKey: process.env.SPACES_SECRET ?? "",
      },
    });
  }

  async uploadFile(
    bucketName: string,
    key: string,
    file: Buffer | Readable,
    contentType: string
  ): Promise<S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    };

    return this.s3Client.upload(params).promise();
  }

  async getFile(bucketName: string, key: string): Promise<Buffer> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const data = await this.s3Client.getObject(params).promise();
    return data.Body as Buffer;
  }
}

export default S3Service;
