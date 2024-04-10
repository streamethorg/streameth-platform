import { IMultiStream } from '@interfaces/stream.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMultiStreamDto implements IMultiStream {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  streamId: string;

  @IsNotEmpty()
  @IsString()
  targetStreamKey: string;

  @IsNotEmpty()
  @IsString()
  targetURI: string;
}
