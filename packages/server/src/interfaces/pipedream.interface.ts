import { Document, Types } from 'mongoose';

export interface IPipedreamUpload {
  title: string;
  description: string;
  devcon_asset_id: string;
  video: string;
  duration: number;
  sources_ipfsHash: string;
  sources_streamethId: string | Types.ObjectId;
  transcript_vtt: string;
  transcript_text: string;
}

export interface IPipedreamResponse {
  devconUpload: {
    result: any;
  };
  video: {
    status: string;
  };
  thumbnail: {
    status: number;
  };
}
