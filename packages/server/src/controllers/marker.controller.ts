import { CreateMarkerDto } from '@dtos/marker/create-marker.dto';
import { IMarker } from '@interfaces/marker.interface';
import MarkerService from '@services/marker.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Marker')
@Route('markers')
export class MarkerController extends Controller {
  private markerService = new MarkerService();

  /**
   * @summary Create markers
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createMarker(
    @Body() body: CreateMarkerDto,
  ): Promise<IStandardResponse<IMarker>> {
    const marker = await this.markerService.create(body);
    return SendApiResponse('marker created', marker);
  }

  /**
   * @summary Update marker
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{markerId}')
  async updateMarker(
    @Path() markerId: string,
    @Body() body: CreateMarkerDto,
  ): Promise<IStandardResponse<IMarker>> {
    const marker = await this.markerService.update(markerId, body);
    return SendApiResponse('marker updated', marker);
  }

  /**
   * @summary Import markers
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post('import')
  async importMarkers(
    @Body()
    body: {
      url: string;
      type: string;
      organizationId: string;
      stageId: string;
    },
  ): Promise<IStandardResponse<Array<IMarker>>> {
    const markers = await this.markerService.importMarkers(body);
    return SendApiResponse('markers imported', markers);
  }

  /**
   * @summary Get all markers
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Get()
  async getAllMarkers(
    @Query() organization: string,
    @Query() stageId: string,
    @Query() date?: string,
  ): Promise<IStandardResponse<Array<IMarker>>> {
    const queryParams = {
      organization,
      stageId,
      date,
    };
    const markers = await this.markerService.getAll(queryParams);
    return SendApiResponse('markers fetched', markers);
  }

  /**
   * @summary Delete marker
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{markerId}')
  async deleteMarker(
    @Path() markerId: string,
    @Body() body: { organizationId: string; subMarkerId: string },
  ): Promise<IStandardResponse<void>> {
    await this.markerService.deleteOne(markerId, body.subMarkerId);
    return SendApiResponse('marker deleted');
  }
}
