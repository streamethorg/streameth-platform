import { IsString, IsOptional, IsBoolean, IsArray, IsMongoId } from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  sessions?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
} 