import { apiUrl } from '../utils/utils';

export const imageUpload = async ({
  data,
  authToken,
}: {
  data: FormData;
  authToken: string;
}): Promise<string> => {
  try {
    const response = await fetch(`${apiUrl()}/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw 'Error uploading image';
    }

    return (await response.json()).data;
  } catch (e) {
    console.log('error in upload image', e);
    throw e;
  }
};
