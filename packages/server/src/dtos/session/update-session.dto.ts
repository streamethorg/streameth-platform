import { IPlayback, ISource, SessionType } from '@interfaces/session.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  start: number;

  @IsOptional()
  @IsString()
  end: number;

  @IsOptional()
  @IsString()
  stageId?: string;

  @IsOptional()
  @IsArray()
  speakers: Omit<ISpeaker, 'organizationId'>[];

  @IsOptional()
  @IsObject()
  source?: ISource;

  @IsOptional()
  @IsObject()
  playback?: IPlayback;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  playbackId?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsArray()
  track?: string[];

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  eventSlug?: string;

  @IsOptional()
  @IsString()
  videoTranscription?: string;

  @IsOptional()
  @IsString()
  aiDescription?: string;

  @IsOptional()
  @IsArray()
  autolabels?: string[];

  @IsOptional()
  @IsString()
  assetId?: string;

  @IsOptional()
  @IsString()
  ipfsURI?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  type: SessionType;

  @IsOptional()
  @IsString()
  nftURI?: string;

  @IsOptional()
  @IsBoolean()
  mintable?: boolean;

  @IsOptional()
  @IsArray()
  nftCollections?: Types.ObjectId | string[];
}
