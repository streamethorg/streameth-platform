import { SessionDto } from '@dtos/session.dto';
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
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
@Tags('Session')
@Route('sessions')
export class SessionController extends Controller {
  private sessionService = new SessionServcie();

  /**
   *
   * @Summary Create session
   */
  @SuccessResponse('201')
  @Post()
  async createSession(
    @Body() body: SessionDto,
  ): Promise<IStandardResponse<ISession>> {
    const session = await this.sessionService.create(body);
    return SendApiResponse('session created', session);
  }

  /**
   *
   * @Summary Update session
   */
  @SuccessResponse('200')
  @Put('{sessionId}')
  async editSession(
    @Path() sessionId: string,
    @Body() body: SessionDto,
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
  async getAllSessions(): Promise<IStandardResponse<Array<ISession>>> {
    const sessions = await this.sessionService.getAll();
    return SendApiResponse('sessions fetched', sessions);
  }
}
