import {
  IScheduleImporter,
  ImportType,
} from '@interfaces/schedule-importer.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class IScheduleImporterDto
  implements Pick<IScheduleImporter, 'url' | 'type' | 'organizationId'>
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
}
