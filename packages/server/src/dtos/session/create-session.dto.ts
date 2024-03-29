import { IPlayback, ISession, ISource } from '@interfaces/session.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSessionDto implements Omit<ISession, '_id'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  start: number;

  @IsNotEmpty()
  @IsString()
  end: number;

  @IsNotEmpty()
  @IsString()
  stageId: string;

  @IsNotEmpty()
  @IsArray()
  speakers: ISpeaker[];

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
  ipfsURI?: string;
}
