import { IMarker } from '@interfaces/marker.interface';
import { ISpeaker } from '@interfaces/speaker.interface';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMarkerDto implements IMarker {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  stageId: string;

  @IsNotEmpty()
  @IsNumber()
  start: number;

  @IsNotEmpty()
  @IsNumber()
  end: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsOptional()
  @IsArray()
  speakers?: ISpeaker[];

  @IsNotEmpty()
  @IsNumber()
  startClipTime: number;

  @IsNotEmpty()
  @IsNumber()
  endClipTime: number;
}
