import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo!: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsEmail()
  address: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
