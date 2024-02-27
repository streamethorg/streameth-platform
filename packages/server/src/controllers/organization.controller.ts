import { CreateOrganizationDto } from '@dtos/organization/create-organization.dto';
import { OrgIdDto } from '@dtos/organization/orgid.dto';
import { UpdateOrganizationDto } from '@dtos/organization/update-organization.dto';
import { IOrganization } from '@interfaces/organization.interface';
import OrganizationService from '@services/organization.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Organization')
@Route('organizations')
export class OrganizationController extends Controller {
  private organizationService = new OrganizationService();

  /**
   * @summary Create organization
   */
  @Security('jwt')
  @SuccessResponse('201')
  @Post()
  async createOrganization(
    @Body() body: CreateOrganizationDto,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.create(body);
    return SendApiResponse('organization created', org);
  }

  /**
   * @summary Update organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{organizationId}')
  async editOrganization(
    @Path() organizationId: string,
    @Body() body: UpdateOrganizationDto,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.update(organizationId, body);
    return SendApiResponse('event updated', org);
  }

  /**
   * @summary Add members to organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('/members/{organizationId}')
  async updateOrgMembers(
    @Path() organizationId: string,
    @Body() body: Pick<CreateOrganizationDto, 'walletAddress'>,
  ): Promise<IStandardResponse<void>> {
    const org = await this.organizationService.updateOrgMembers(
      organizationId,
      body.walletAddress,
    );
    return SendApiResponse('member added', org);
  }

  /**
   * @summary Get organization by
   */
  @SuccessResponse('200')
  @Get('{organizationId}')
  async getOrganizationById(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.get(organizationId);
    return SendApiResponse('organization fetched', org);
  }

  /**
   * @summary Get all organizations
   */
  @SuccessResponse('200')
  @Get()
  async getAllOrganizations(): Promise<
    IStandardResponse<Array<IOrganization>>
  > {
    const orgs = await this.organizationService.getAll();
    return SendApiResponse('organizations fetched', orgs);
  }

  /**
   * @summary Delete organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{organizationId}')
  async deleteOrganization(
    @Path() organizationId: string,
    @Body() _organizationId: OrgIdDto,
  ): Promise<IStandardResponse<void>> {
    await this.organizationService.deleteOne(organizationId);
    return SendApiResponse('deleted');
  }
}
