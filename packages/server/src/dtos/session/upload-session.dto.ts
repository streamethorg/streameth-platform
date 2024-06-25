import { IUploadSession } from '@interfaces/upload.session.interface';
import { IsNotEmpty, IsString } from 'class-validator';

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
}
