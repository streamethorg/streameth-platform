import { downloadM3U8ToMP4 } from '@avtools/ffmpeg';
import { CreateSessionDto } from '@dtos/session/create-session.dto';
import { UpdateSessionDto } from '@dtos/session/update-session.dto';
import { IGoogleToken } from '@interfaces/googletoken.interface';
import { ISession } from '@interfaces/session.interface';
import SessionServcie from '@services/session.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import createOAuthClient from '@utils/oauth';
import { existsSync } from 'fs';
import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';
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
   * @Summary Upload session to YouTube
   */
  @SuccessResponse('201')
  @Get('upload/{sessionId}')
  async uploadSessionToYouTube(
    @Path() sessionId: string,
    @Query() googleToken: string,
  ): Promise<IStandardResponse<ISession>> {
    const session = await this.sessionService.get(sessionId);
    const tokens: Credentials = JSON.parse(decodeURIComponent(googleToken));

    const oAuthClient = await createOAuthClient();
    oAuthClient.setCredentials(tokens);

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuthClient,
    });

    if (!session.videoUrl) {
      console.log('video Url does not exist');
      return SendApiResponse('Video url does not exist', null, '500');
    }

    const videoFilePath = `./tmp/${session.slug}.mp4`;
    if (!existsSync(videoFilePath)) {
      await downloadM3U8ToMP4(session.videoUrl, session.slug, './tmp');
    }

    await this.sessionService.uploadToYouTube(session, youtube, videoFilePath);

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
