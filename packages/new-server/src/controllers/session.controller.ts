import S3Service from '@app/lib/services/spacesService';
import { downloadM3U8ToMP4 } from '@avtools/ffmpeg';
import { CreateSessionDto } from '@dtos/session/create-session.dto';
import { UpdateSessionDto } from '@dtos/session/update-session.dto';
import { ISession } from '@interfaces/session.interface';
import SessionServcie from '@services/session.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import createOAuthClient from '@utils/oauth';
import { createReadStream, existsSync, createWriteStream } from 'fs';
import { google } from 'googleapis';
import https from 'https';
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
   * @Summary Upload session to YouTube
   */
  @SuccessResponse('201')
  @Get('upload/{sessionId}')
  async uploadSessionToYouTube(
    @Path() sessionId: string,
    @Query() googleToken: string,
  ): Promise<IStandardResponse<ISession>> {
    // TODO: Make type for tokens
    const session = await this.sessionService.get(sessionId);
    const tokens = JSON.parse(decodeURIComponent(googleToken));

    const oAuthClient = await createOAuthClient();
    oAuthClient.setCredentials(tokens);

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuthClient,
    });

    if (!session.videoUrl) {
      console.log('video Url does not exist');
      return SendApiResponse('Video url does not exist');
    }

    const videoFilePath = `./tmp/${session.slug}.mp4`;
    if (!existsSync(videoFilePath)) {
      await downloadM3U8ToMP4(session.videoUrl, session.slug, './tmp');
    }

    youtube.videos.insert(
      {
        part: ['status', 'snippet'],
        requestBody: {
          snippet: {
            title: session.name,
            description: session.description,
            defaultLanguage: 'en',
            defaultAudioLanguage: 'en',
          },
          status: {
            privacyStatus: 'private', //TODO: Change this once done
          },
        },
        media: {
          body: createReadStream(videoFilePath),
        },
      },
      async function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        console.log(response.data);

        if (!session.coverImage) {
          return;
        }

        const filePath = `./tmp/${session.slug}.jpg`;
        https
          .get(session.coverImage, (response) => {
            if (response.statusCode === 200) {
              const fileStream = createWriteStream(filePath);
              response.pipe(fileStream);

              fileStream.on('finish', () => {
                fileStream.close();
                console.log('Download completed and file saved to', filePath);
              });
            } else {
              console.log(
                'Request failed with status code:',
                response.statusCode,
              );
            }
          })
          .on('error', (error) => {
            console.error('Error downloading the file:', error.message);
            return;
          });

        console.log('Video uploaded. Uploading the thumbnail now.');
        youtube.thumbnails.set(
          {
            videoId: response.data.id,
            media: {
              body: createReadStream(filePath),
            },
          },
          function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            }
            console.log(response.data);
          },
        );
      },
    );

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
