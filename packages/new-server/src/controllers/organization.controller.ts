import { OrganizationDto } from '@dtos/organization.dto';
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

  @Security('jwt')
  @SuccessResponse('201')
  @Post()
  async createOrganization(
    @Body() body: OrganizationDto,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.create(body);
    return SendApiResponse('organization created', org);
  }

  @Security('jwt')
  @SuccessResponse('200')
  @Put('{organizationId}')
  async editOrganization(
    @Path() organizationId: string,
    @Body() body: OrganizationDto,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.update(organizationId, body);
    return SendApiResponse('event updated', org);
  }

  @SuccessResponse('200')
  @Get('{organizationId}')
  async getOrganizationById(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<IOrganization>> {
    const org = await this.organizationService.get(organizationId);
    return SendApiResponse('organization fetched', org);
  }

  @SuccessResponse('200')
  @Get()
  async getAllOrganizations(): Promise<
    IStandardResponse<Array<IOrganization>>
  > {
    const orgs = await this.organizationService.getAll();
    return SendApiResponse('organizations fetched', orgs);
  }

  @Security('jwt')
  @SuccessResponse('200')
  @Delete('{organizationId}')
  async deleteOrganization(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<void>> {
    await this.organizationService.deleteOne(organizationId);
    return SendApiResponse('deleted');
  }
}
