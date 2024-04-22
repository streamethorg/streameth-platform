import { NftCollectionType } from '@interfaces/nft.collection.interface';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateNftCollectionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  type: NftCollectionType;

  @IsOptional()
  @IsString()
  organizationId: string | Types.ObjectId;

  @IsOptional()
  @IsArray()
  videos?: {
    type: string;
    sessionId?: string;
    stageId?: string;
  }[];
}
