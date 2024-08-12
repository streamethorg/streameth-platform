import { IUploadSession } from '@interfaces/upload.session.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadSessionDto implements IUploadSession {
  @IsNotEmpty()
  @IsString()
  socialId: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  text?: string;
}
