import { CreateOrganizationDto } from '@dtos/organization/create-organization.dto';
import { UpdateOrganizationDto } from '@dtos/organization/update-organization.dto';
import { IOrganization, ISocials } from '@interfaces/organization.interface';
import { IUser } from '@interfaces/user.interface';
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
   * @summary Add member to organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('/member/{organizationId}')
  async updateOrgMembers(
    @Path() organizationId: string,
    @Body() body: Pick<CreateOrganizationDto, 'address'>,
  ): Promise<IStandardResponse<void>> {
    const org = await this.organizationService.addOrgMember(
      organizationId,
      body.address,
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
   * @summary Get all organization members
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Get('/member/{organizationId}')
  async getAllOrgMembers(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<Array<IUser>>> {
    const users = await this.organizationService.getOrgMembers(organizationId);
    return SendApiResponse('organization members fetched', users);
  }

  /**
   * @summary Delete organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{organizationId}')
  async deleteOrganization(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<void>> {
    await this.organizationService.deleteOne(organizationId);
    return SendApiResponse('deleted');
  }

  /**
   * @summary Delete organization member
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('/member/{organizationId}')
  async deleteOrgMember(
    @Path() organizationId: string,
    @Body() body: Pick<CreateOrganizationDto, 'address'>,
  ): Promise<IStandardResponse<void>> {
    const org = await this.organizationService.deleteOrgMember(
      organizationId,
      body.address,
    );
    return SendApiResponse('memeber deleted', org);
  }

  /**
   * @summary Add socials to organization
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('/socials/{organizationId}')
  async updateOrgSocials(
    @Path() organizationId: string,
    @Body() body: ISocials,
  ): Promise<IStandardResponse<void>> {
    const org = await this.organizationService.addOrgSocial(
      organizationId,
      body,
    );
    return SendApiResponse('social added', org);
  }

  /**
   * @summary Delete organization social
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('/socials/{organizationId}')
  async deleteOrgSocial(
    @Path() organizationId: string,
    @Body() body: { destinationId: string },
  ): Promise<IStandardResponse<void>> {
    const org = await this.organizationService.deleteOrgSocial(
      organizationId,
      body.destinationId,
    );
    return SendApiResponse('social deleted', org);
  }
}
