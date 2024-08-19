import { IUploadSession } from '@interfaces/upload.session.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadSessionDto implements IUploadSession {
  @IsString()
  @IsOptional()
  socialId?: string;

  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
