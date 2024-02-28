import {
  IDataExporter,
  IDataImporter,
  IEvent,
  IPlugins,
} from '@interfaces/event.interface';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateEventDto implements IEvent {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  start!: string;

  @IsOptional()
  @IsString()
  end!: string;

  @IsOptional()
  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  banner: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsArray()
  dataImporter?: IDataImporter[];

  @IsOptional()
  @IsString()
  eventCover?: string;

  @IsOptional()
  @IsBoolean()
  archiveMode?: boolean;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  timezone: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsOptional()
  @IsBoolean()
  unlisted?: boolean;

  @IsOptional()
  @IsArray()
  dataExporter?: IDataExporter[];

  @IsOptional()
  @IsBoolean()
  enableVideoDownloader?: boolean;

  @IsOptional()
  @IsObject()
  plugins?: IPlugins;

  slug?: string;
}
