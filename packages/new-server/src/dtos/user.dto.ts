import { IUser, UserRole } from '@interfaces/user.interface';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  walletAddress!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  organizations?: Types.ObjectId[];
  role?: UserRole;
  token?: string;
}
