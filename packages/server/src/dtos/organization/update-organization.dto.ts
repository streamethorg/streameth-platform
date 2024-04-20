import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
