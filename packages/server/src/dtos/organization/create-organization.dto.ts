import { IOrganization } from '@interfaces/organization.interface';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateOrganizationDto implements Omit<IOrganization, '_id'> {
  @IsNotEmpty()
  @IsString()
  name!: string;

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
}
