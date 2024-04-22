import { downloadM3U8ToMP4 } from '@avtools/ffmpeg';
import { OrgIdDto } from '@dtos/organization/orgid.dto';
import { CreateSessionDto } from '@dtos/session/create-session.dto';
import { UpdateSessionDto } from '@dtos/session/update-session.dto';
import { ISession } from '@interfaces/session.interface';
import SessionServcie from '@services/session.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import createOAuthClient from '@utils/oauth';
import { uploadToYouTube } from '@utils/youtube';
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
  Delete,
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
  @Post('upload/{sessionId}')
  async uploadSessionToYouTube(
    @Path() sessionId: string,
    @Query() googleToken: string,
  ): Promise<IStandardResponse<ISession>> {
    try {
      const session = await this.sessionService.get(sessionId);
      const tokens: Credentials = JSON.parse(decodeURIComponent(googleToken));

      const oAuthClient = await createOAuthClient();
      oAuthClient.setCredentials(tokens);

      const youtube = google.youtube({
        version: 'v3',
        auth: oAuthClient,
      });

      if (!session.assetId || !session.videoUrl) {
        console.log('Asset Id or video Url does not exist');
        return SendApiResponse(
          'Asset Id or video Url does not exist',
          null,
          '500',
        );
      }

      const videoFilePath = `./tmp/${session.slug}.mp4`;
      if (!existsSync(videoFilePath)) {
        await downloadM3U8ToMP4(session.videoUrl, session.slug, './tmp');
      }

      console.log('Uploading video...');
      await uploadToYouTube(session, youtube, videoFilePath);

      return SendApiResponse('session fetched', session);
    } catch (e) {
      return SendApiResponse(
        'An error while uploading a video to YouTube',
        e.toString(),
        '500',
      );
    }
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
