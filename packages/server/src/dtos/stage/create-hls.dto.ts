import { IStage } from '@interfaces/stage.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHlsStageDto implements IStage {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
