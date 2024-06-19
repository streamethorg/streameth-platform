import { IPlugin, IStage } from '@interfaces/stage.interface';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateStageDto implements IStage {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  eventId?: string;

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
  streamDate?: Date;

  @IsOptional()
  @IsString()
  streamEndDate?: Date;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  isMultipleDate?: boolean;
}
