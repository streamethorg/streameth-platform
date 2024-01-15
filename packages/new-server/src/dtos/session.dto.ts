import { IPlayback, ISession, ISource } from '@interfaces/session.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class SessionDto implements ISession {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  start: string;

  @IsNotEmpty()
  @IsString()
  end: string;

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

  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsOptional()
  @IsArray()
  track?: string[];

  @IsOptional()
  @IsString()
  coverImage?: string;
}
