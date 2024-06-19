import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClipDto {
  @IsNotEmpty()
  @IsString()
  playbackId!: string;

  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsNotEmpty()
  @IsString()
  recordingId!: string;

  @IsNotEmpty()
  @IsNumber()
  start!: number;

  @IsNotEmpty()
  @IsNumber()
  end!: number;
}
