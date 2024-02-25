import { IOrganization } from '@interfaces/organization.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto implements Omit<IOrganization, '_id'> {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  url!: string;

  @IsNotEmpty()
  @IsString()
  logo!: string;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsNotEmpty()
  @IsString()
  walletAddress: string;
}
