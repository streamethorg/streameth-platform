import { IScheduleImporterDto } from '@dtos/schedule-importer/create-import.dto';
import ScheduleImporterService from '@services/schedule-import.service';
import { type IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa';

@Tags('Schedule')
@Route('schedule')
export class ScheduleImporterController extends Controller {
  private importerService = new ScheduleImporterService();

  @SuccessResponse('201')
  @Post('import')
  async importSchdeule(
    @Body() body: Pick<IScheduleImporterDto, 'url' | 'type' | 'organizationId'>,
  ): Promise<IStandardResponse<void>> {
    const importer = await this.importerService.importData(body);
    return SendApiResponse('schedule generated', importer);
  }
}
