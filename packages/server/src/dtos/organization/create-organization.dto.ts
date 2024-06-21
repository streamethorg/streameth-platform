import { IOrganization, ISocials } from '@interfaces/organization.interface';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateOrganizationDto implements Omit<IOrganization, '_id'> {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  logo!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  url?: string;

  address?: string;

  @IsOptional()
  @IsArray()
  socials?: ISocials[];
}
