import { ISpeaker } from '@interfaces/speaker.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SpeakerDto implements ISpeaker {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
