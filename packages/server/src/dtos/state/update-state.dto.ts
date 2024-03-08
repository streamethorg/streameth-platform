import { SheetType, StateStatus, StateType } from '@interfaces/state.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateStateDto {
  @IsOptional()
  @IsString()
  eventId?: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  sessionId?: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  eventSlug?: string;

  @IsOptional()
  @IsString()
  sessionSlug?: string;

  @IsNotEmpty()
  @IsString()
  sheetType: SheetType;

  @IsNotEmpty()
  @IsString()
  StateStatus: StateStatus;

  @IsOptional()
  @IsString()
  type?: StateType;
}
