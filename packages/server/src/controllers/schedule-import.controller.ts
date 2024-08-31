import { IScheduleImporterDto } from '@dtos/schedule-importer/create-import.dto';
import ScheduleImporterService from '@services/schedule-import.service';
import { type IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Schedule')
@Route('schedule')
export class ScheduleImporterController extends Controller {
  private importerService = new ScheduleImporterService();

  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('import')
  async importSchdeule(
    @Body() body: Pick<IScheduleImporterDto, 'url' | 'type' | 'organizationId'>,
  ): Promise<IStandardResponse<void>> {
    const importer = await this.importerService.importSessionsAndStage(body);
    return SendApiResponse('schedule generated', importer);
  }

  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('import/stage')
  async importSchdeuleByStage(
    @Body()
    body: Pick<
      IScheduleImporterDto,
      'url' | 'type' | 'organizationId' | 'stageId'
    >,
  ): Promise<IStandardResponse<void>> {
    const importer = await this.importerService.importByStage(body);
    return SendApiResponse('schedule generated', importer);
  }

  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('import/save')
  async save(
    @Body() body: { scheduleId: string },
  ): Promise<IStandardResponse<void>> {
    await this.importerService.save(body.scheduleId);
    return SendApiResponse('schedule saved');
  }
}
