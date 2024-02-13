import {
  IDataExporter,
  IDataImporter,
  IEvent,
  IPlugins,
} from '@interfaces/event.interface';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto implements IEvent {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  start!: Date;

  @IsNotEmpty()
  @IsString()
  end!: Date;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  banner: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
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
