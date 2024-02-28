import { ISupport } from '@interfaces/support.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportTicketDto implements ISupport {
  @IsNotEmpty()
  @IsString()
  message!: string;
}
