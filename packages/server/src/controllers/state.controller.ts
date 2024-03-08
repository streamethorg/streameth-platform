import { CreateStateDto } from '@dtos/state/create-state.dto';
import { UpdateStateDto } from '@dtos/state/update-state.dto';
import { IState } from '@interfaces/state.interface';
import StateService from '@services/state.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
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

@Tags('State')
@Route('state')
export class StateController extends Controller {
  private stateService = new StateService();

  /**
   *
   * @Summary Create state
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createState(
    @Body() body: CreateStateDto,
  ): Promise<IStandardResponse<IState>> {
    const state = await this.stateService.create(body);
    return SendApiResponse('state created', state);
  }
  /**
   *
   * @Summary Edit state
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{stateId}')
  async updateState(
    @Path() stateId: string,
    @Body() body: UpdateStateDto,
  ): Promise<IStandardResponse<IState>> {
    const state = await this.stateService.update(stateId, body);
    return SendApiResponse('state updated', state);
  }

  /**
   *
   * @Summary Get all states
   */
  @SuccessResponse('200')
  @Get()
  async getAllStates(
    @Query() eventId?: string,
    @Query() sessionId?: string,
    @Query() eventSlug?: string,
  ): Promise<IStandardResponse<Array<IState>>> {
    const queryParams = {
      eventId: eventId,
      sessionId: sessionId,
      eventSlug: eventSlug,
    };
    const states = await this.stateService.getAll(queryParams);
    return SendApiResponse('States fetched', states);
  }
}
