import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class PipedreamUploadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  devcon_asset_id: string;

  @IsString()
  @IsNotEmpty()
  video: string;

  @IsNumber()
  duration: number;

  @IsString()
  sources_ipfsHash: string;

  @IsString()
  @IsNotEmpty()
  sources_streamethId: string;
}
