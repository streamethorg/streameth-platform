import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMultiStreamDto {
  @IsNotEmpty()
  @IsString()
  streamId: string;

  @IsNotEmpty()
  @IsString()
  targetId: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
