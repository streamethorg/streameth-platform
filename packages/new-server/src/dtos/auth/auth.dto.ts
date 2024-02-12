import { IAuth, IGoogleAuth } from '@interfaces/auth.interface';
import { IsNotEmpty, ValidateNested, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthDto implements IAuth {
  @IsNotEmpty()
  @IsString()
  token!: string;
}

class WebAuthDetails {
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  project_id: string;

  @IsNotEmpty()
  @IsString()
  auth_uri: string;

  @IsNotEmpty()
  @IsString()
  token_uri: string;

  @IsNotEmpty()
  @IsString()
  auth_provider_x509_cert_url: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  javascript_origins: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  redirect_uris: string[];
}

export class GoogleAuthDto implements IGoogleAuth {
  @ValidateNested()
  @Type(() => WebAuthDetails)
  web: WebAuthDetails;
}
