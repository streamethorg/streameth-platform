import { IsString, IsOptional, IsBoolean, IsArray, IsMongoId } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsMongoId({ each: true })
  sessions: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
} 