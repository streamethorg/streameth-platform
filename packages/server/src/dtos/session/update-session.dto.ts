import { IPlayback, ISource } from '@interfaces/session.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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
  stageId: string;

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
}
