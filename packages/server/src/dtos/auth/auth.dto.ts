import { AuthType, IAuth } from '@interfaces/auth.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto implements IAuth {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsOptional()
  @IsString()
  type?: AuthType;

  @IsOptional()
  @IsString()
  email?: string;
}
