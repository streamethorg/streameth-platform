import { ILiveStream } from '@interfaces/stage.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLiveStreamDto implements ILiveStream {
  @IsNotEmpty()
  @IsString()
  stageId: string;

  @IsNotEmpty()
  @IsString()
  socialId: string;

  @IsNotEmpty()
  @IsString()
  socialType: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
