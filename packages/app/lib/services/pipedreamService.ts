import { apiUrl } from '@/lib/utils/utils';
import { Types } from 'mongoose';

export interface IPipedreamUpload {
  title: string;
  description: string;
  devcon_asset_id: string;
  video: string;
  duration: number;
  sources_ipfsHash: string;
  sources_streamethId: string;
}

export const uploadToDevcon = async (payload: IPipedreamUpload) => {
  //   console.log('Frontend - Sending payload to backend:', payload);

  const response = await fetch(`${apiUrl()}/pipedream/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      sources_streamethId: payload.sources_streamethId.toString(),
    }),
  });

  const responseData = await response.json();
  //   console.log('Frontend - Received response from backend:', responseData);

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to upload to Devcon');
  }

  return responseData;
};
