import { IChat, IFrom } from '@interfaces/chat.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto implements IChat {
  @IsNotEmpty()
  @IsString()
  stageId!: string;

  @IsNotEmpty()
  @IsString()
  from!: IFrom;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsString()
  timestamp!: number;
}
