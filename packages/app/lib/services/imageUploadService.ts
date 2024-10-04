import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export const imageUpload = async ({
  data,
}: {
  data: FormData;
}): Promise<string> => {
  try {
    const response = await fetchClient(`${apiUrl()}/upload`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {},
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
