import { IUser } from '@interfaces/user.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto implements Pick<IUser, "walletAddress"|"signature"|"nonce"> {
  @IsNotEmpty()
  @IsString()
  walletAddress!: string;

  @IsNotEmpty()
  @IsString()
  signature!: string;

  @IsNotEmpty()
  @IsString()
  nonce!: string;
}
