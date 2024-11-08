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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload to Devcon');
  }

  return response.json();
};
