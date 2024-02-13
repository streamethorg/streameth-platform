import { CreateSessionDto } from '@dtos/session/create-session.dto';
import { UpdateSessionDto } from '@dtos/session/update-session.dto';
import { ISession } from '@interfaces/session.interface';
import SessionServcie from '@services/session.service';
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
  SuccessResponse,
  Tags,
  Security,
} from 'tsoa';
@Tags('Session')
@Route('sessions')
export class SessionController extends Controller {
  private sessionService = new SessionServcie();

  /**
   *
   * @Summary Create session
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createSession(
    @Body() body: CreateSessionDto,
  ): Promise<IStandardResponse<ISession>> {
    console.log(body);
    const session = await this.sessionService.create(body);
    return SendApiResponse('session created', session);
  }

  /**
   *
   * @Summary Update session
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Put('{sessionId}')
  async editSession(
    @Path() sessionId: string,
    @Body() body: UpdateSessionDto,
  ): Promise<IStandardResponse<ISession>> {
    const session = await this.sessionService.update(sessionId, body);
    return SendApiResponse('session updated', session);
  }

  /**
   *
   * @Summary Fetch session by id
   */
  @SuccessResponse('200')
  @Get('{sessionId}')
  async getSessionById(
    @Path() sessionId: string,
  ): Promise<IStandardResponse<ISession>> {
    const session = await this.sessionService.get(sessionId);
    return SendApiResponse('session fetched', session);
  }

  /**
   *
   * @Summary Get all sessions
   */
  @SuccessResponse('200')
  @Get()
  async getAllSessions(
    @Query() event?: string,
    @Query() organization?: string,
    @Query() speaker?: string,
    @Query() stageId?: string,
    @Query() onlyVideos?: boolean,
    @Query() page?: number,
    @Query() size?: number,
    @Query() timestamp?: number,
    @Query() assetId?: string,
  ): Promise<
    IStandardResponse<{
      sessions: Array<ISession>;
      totalDocuments: number;
      pageable: { page: number; size: number };
    }>
  > {
    const queryParams = {
      event: event,
      organization: organization,
      speaker: speaker,
      stageId: stageId,
      onlyVideos: onlyVideos,
      page: page,
      size: size,
      timestamp: timestamp,
      assetId: assetId,
    };
    const sessions = await this.sessionService.getAll(queryParams);
    return SendApiResponse('sessions fetched', sessions);
  }
}
