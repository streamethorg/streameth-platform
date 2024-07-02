import { OrgIdDto } from '@dtos/organization/orgid.dto';
import { CreateSessionDto } from '@dtos/session/create-session.dto';
import { UpdateSessionDto } from '@dtos/session/update-session.dto';
import { UploadSessionDto } from '@dtos/session/upload-session.dto';
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
  Delete,
} from 'tsoa';

@Tags('Session')
@Route('sessions')
export class SessionController extends Controller {
  private sessionService = new SessionServcie();

  /**
   * @summary Create Session
   */
  @Security('jwt', ['org'])
  @SuccessResponse('201')
  @Post()
  async createSession(
    @Body() body: CreateSessionDto,
  ): Promise<IStandardResponse<ISession>> {
    const session = await this.sessionService.create(body);
    return SendApiResponse('session created', session);
  }

  /**
   * @summary Update Session
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
   * @summary Get all event sessions
   */
  @SuccessResponse('200')
  @Get('organization/{organizationId}')
  async getOrgEventSessions(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<Array<ISession>>> {
    const sessions =
      await this.sessionService.getOrgEventSessions(organizationId);
    return SendApiResponse('sessions fetched', sessions);
  }

  /**
   * @summary Search sessions
   */
  @SuccessResponse('200')
  @Get('search')
  async filterSession(
    @Query() search: string,
  ): Promise<IStandardResponse<Array<ISession>>> {
    const sessions = await this.sessionService.filterSessions(search);
    return SendApiResponse('sessions fetched', sessions);
  }

  /**
   * @summary Search sessions per organisation
   */
  @SuccessResponse('200')
  @Get('{organizationSlug}/search')
  async filterSessionByOrganisation(
    @Path() organizationSlug: string,
    @Query() search: string,
  ): Promise<IStandardResponse<Array<ISession>>> {
    const sessions = await this.sessionService.filterSessions(
      search,
      organizationSlug,
    );
    return SendApiResponse('sessions fetched', sessions);
  }

  /**
   * @summary Fetch session by id
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
   * @summary Publish session to socials
   */
  @SuccessResponse('201')
  @Post('upload')
  async uploadSessionToSocials(
    @Body() body: UploadSessionDto,
  ): Promise<IStandardResponse<void>> {
    await this.sessionService.uploadSessionToSocials(body);
    return SendApiResponse('uploading video');
  }

  /**
   * @summary Get All Session
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
    @Query() published?: boolean,
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
      published: published,
    };
    const sessions = await this.sessionService.getAll(queryParams);
    return SendApiResponse('sessions fetched', sessions);
  }

  /**
   * @summary Delete Session
   */
  @Security('jwt', ['org'])
  @SuccessResponse('200')
  @Delete('{sessionId}')
  async deleteSession(
    @Path() sessionId: string,
    @Body() organizationId: OrgIdDto,
  ): Promise<IStandardResponse<void>> {
    await this.sessionService.deleteOne(sessionId);
    return SendApiResponse('deleted');
  }
}
