import { IPlugin, IStreamSettings } from '@interfaces/stage.interface';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateStageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  isMultipleDate?: boolean;

  @IsOptional()
  @IsObject()
  streamSettings?: IStreamSettings;

  @IsOptional()
  @IsArray()
  plugins?: IPlugin[];

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  slug?: string;

  @IsOptional()
  @IsString()
  streamDate?: string;

  @IsOptional()
  @IsString()
  streamEndDate?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  mintable?: boolean;

  @IsOptional()
  @IsArray()
  nftCollections?: Types.ObjectId | string[];

  @IsOptional()
  @IsObject()
  source?: {
    url: string;
    m3u8Url: string;
    type: string;
  };

  @IsOptional()
  @IsString()
  type?: string;
}
