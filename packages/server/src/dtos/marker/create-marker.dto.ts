import { IMarker } from '@interfaces/marker.interface';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMarkerDto implements IMarker {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsArray()
  metadata: Array<{
    start: number;
    end: number;
    color: string;
    title: string;
    description: string;
  }>;
}
