import {
  IScheduleImporter,
  ImportType,
} from '@interfaces/schedule-importer.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IScheduleImporterDto
  implements
    Pick<IScheduleImporter, 'url' | 'type' | 'organizationId' | 'stageId'>
{
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  type: ImportType;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsOptional()
  @IsString()
  stageId: string;
}
