import { IAuth } from '@interfaces/auth.interface';
import { IsNotEmpty, IsString } from 'class-validator';
export class AuthDto implements IAuth {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
