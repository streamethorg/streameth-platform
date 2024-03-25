import { IPlugin, IStreamSettings } from '@interfaces/stage.interface';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateStageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsNotEmpty()
  @IsObject()
  streamSettings: IStreamSettings;

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
}
