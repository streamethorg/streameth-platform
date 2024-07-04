import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { config } from '@config';
import { HttpException } from '@exceptions/HttpException';

export const uploadSingleMetadata = async (
  file: Express.Multer.File | {}
): Promise<string> => {
  try {
    const storage = new ThirdwebStorage({
      secretKey: config.storage.thirdWebSecretKey,
    });
    const url = await storage.upload(file);
    return await resolveIpfsUrl(url);
  } catch (e) {
    throw new HttpException(400, 'Error uploading data');
  }
};

export const uploadMultipleMetadata = async (
  files: Express.Multer.File[] | Array<string>
): Promise<Array<string>> => {
  try {
    const storage = new ThirdwebStorage({
      secretKey: config.storage.thirdWebSecretKey,
    });
    const uploads = await storage.uploadBatch(files);
    const resolvedUrls = await Promise.all(
      uploads.map((url) => resolveIpfsUrl(url))
    );
    return resolvedUrls;
  } catch (e) {
    throw new HttpException(400, 'Error uploading data');
  }
};

const resolveIpfsUrl = async (url: string): Promise<string> => {
  const storage = new ThirdwebStorage({
    secretKey: config.storage.thirdWebSecretKey,
  });
  return await storage.resolveScheme(url);
};
