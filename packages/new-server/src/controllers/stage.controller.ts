import { StageDto } from '@dtos/stage.dto';
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
} from 'tsoa';

@Tags('Stage')
@Route('stages')
export class StageController extends Controller {
  private stageService = new StageService();

  @Security('jwt')
  @SuccessResponse('201')
  @Post()
  async createStage(
    @Body() body: StageDto,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.create(body);
    return SendApiResponse('stage created', stage);
  }

  @Security('jwt')
  @SuccessResponse('200')
  @Put('{stageId}')
  async editStage(
    @Path() stageId: string,
    @Body() body: StageDto,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.update(stageId, body);
    return SendApiResponse('stage updated', stage);
  }

  @SuccessResponse('200')
  @Get('{stageId}')
  async getStageById(
    @Path() stageId: string,
  ): Promise<IStandardResponse<IStage>> {
    const stage = await this.stageService.get(stageId);
    return SendApiResponse('stage fetched', stage);
  }

  @SuccessResponse('200')
  @Get()
  async getAllStages(): Promise<IStandardResponse<Array<IStage>>> {
    const stages = await this.stageService.getAll();
    return SendApiResponse('stages fetched', stages);
  }

  @SuccessResponse('200')
  @Get('/event/{eventId}')
  async getAllStagesForEvent(
    eventId: string,
  ): Promise<IStandardResponse<Array<IStage>>> {
    const stages = await this.stageService.findAllStagesForEvent(eventId);
    return SendApiResponse('stages fetched', stages);
  }

  @Security('jwt')
  @SuccessResponse('200')
  @Delete('{stageId}')
  async deleteStage(@Path() stageId: string): Promise<IStandardResponse<void>> {
    const stage = await this.stageService.deleteOne(stageId);
    return SendApiResponse('deleted', stage);
  }
}
