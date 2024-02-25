import { IsNotEmpty, IsString } from 'class-validator';

export class OrgIdDto {
  @IsNotEmpty()
  @IsString()
  organizationId!: string;
}
