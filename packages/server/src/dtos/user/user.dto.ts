import { IUser } from '@interfaces/user.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto implements Pick<IUser, 'token'> {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
