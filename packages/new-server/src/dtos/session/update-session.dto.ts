import { IPlayback, ISource } from '@interfaces/session.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

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
  eventId: string;

  @IsOptional()
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
}
