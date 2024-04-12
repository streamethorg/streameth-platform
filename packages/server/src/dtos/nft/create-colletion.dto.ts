import { INftCollection, NftCollectionType } from '@interfaces/nft.collection.interface';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNftCollectionDto implements INftCollection {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  type: NftCollectionType;

  @IsNotEmpty()
  @IsString()
  organizationId: string | Types.ObjectId;
}
