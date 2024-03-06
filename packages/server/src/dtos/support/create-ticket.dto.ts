import { ISupport } from '@interfaces/support.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupportTicketDto implements ISupport {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
