import {
  IState,
  SheetType,
  StateStatus,
  StateType,
} from '@interfaces/state.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStateDto implements IState {
  @IsOptional()
  @IsString()
  eventId?: string | Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  organizationId: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  sessionId?: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  eventSlug?: string;

  @IsOptional()
  @IsString()
  sessionSlug?: string;

  @IsOptional()
  @IsString()
  sheetType?: SheetType;

  @IsNotEmpty()
  @IsString()
  status?: StateStatus;

  @IsNotEmpty()
  @IsString()
  type?: StateType;
}
