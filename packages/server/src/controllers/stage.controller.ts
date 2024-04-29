import { OrgIdDto } from '@dtos/organization/orgid.dto';
import { CreateStageDto } from '@dtos/stage/create-stage.dto';
import { UpdateStageDto } from '@dtos/stage/update-stage.dto';
import { IStage } from '@interfaces/stage.interface';
import StageService from '@services/stage.service';
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
  SuccessResponse,
  Tags,
  Security,
  Query,
} from 'tsoa';

@Tags('Stage')
@Route('stages')
export class StageController extends Controller {
  private stageService = new StageService();

  /**
   * @summary Create Session
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createStage(
    @Body() body: CreateStageDto,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.create(body);
    return SendApiResponse('stage created', stage);
  }

  /**
   * @summary Update Stage
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{stageId}')
  async editStage(
    @Path() stageId: string,
    @Body() body: UpdateStageDto,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.update(stageId, body);
    return SendApiResponse('stage updated', stage);
  }

  /**
   * @summary Get Stage by id
   */
  @SuccessResponse('200')
  @Get('{stageId}')
  async getStageById(
    @Path() stageId: string,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.get(stageId);
    return SendApiResponse('stage fetched', stage);
  }

  /**
   * @summary Get All Stage
   */
  @SuccessResponse('200')
  @Get()
  async getAllStages(
    @Query() published?: boolean,
  ): Promise<IStandardResponse<Array<IStage>>> {
    const queryParams = {
      published: published,
    };
    const stages = await this.stageService.getAll(queryParams);
    return SendApiResponse('stages fetched', stages);
  }

  /**
   * @summary Get All Stage for Event
   */
  @SuccessResponse('200')
  @Get('/event/{eventId}')
  async getAllStagesForEvent(
    eventId: string,
  ): Promise<IStandardResponse<Array<IStage>>> {
    const stages = await this.stageService.findAllStagesForEvent(eventId);
    return SendApiResponse('stages fetched', stages);
  }

  /**
   * @summary Get All Stage for Organization
   */
  @SuccessResponse('200')
  @Get('/organization/{organizationId}')
  async getAllStagesForOrganization(
    organizationId: string,
  ): Promise<IStandardResponse<Array<IStage>>> {
    const stages =
      await this.stageService.findAllStagesForOrganization(organizationId);
    return SendApiResponse('stages fetched', stages);
  }

  /**
   * @summary Delete Stage
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{stageId}')
  async deleteStage(
    @Path() stageId: string,
    @Body() organizationId: OrgIdDto,
  ): Promise<IStandardResponse<void>> {
    const stage = await this.stageService.deleteOne(stageId);
    return SendApiResponse('deleted', stage);
  }
}
