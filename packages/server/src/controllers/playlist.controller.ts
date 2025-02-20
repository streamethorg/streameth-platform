import { CreatePlaylistDto } from '@dtos/playlist/create-playlist.dto';
import { UpdatePlaylistDto } from '@dtos/playlist/update-playlist.dto';
import { IPlaylist } from '@interfaces/playlist.interface';
import PlaylistService from '@services/playlist.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Playlist')
@Route('playlists')
export class PlaylistController extends Controller {
  private playlistService = new PlaylistService();

  /**
   * @summary Create playlist
   */
  @SuccessResponse('201')
  @Post('{organizationId}')
  async createPlaylist(
    @Path() organizationId: string,
    @Body() body: CreatePlaylistDto,
  ): Promise<IStandardResponse<IPlaylist>> {
    const playlist = await this.playlistService.create(organizationId, body);
    return SendApiResponse('playlist created', playlist);
  }

  /**
   * @summary Update playlist
   */
  @SuccessResponse('200')
  @Put('{organizationId}/{playlistId}')
  async updatePlaylist(
    @Path() organizationId: string,
    @Path() playlistId: string,
    @Body() body: UpdatePlaylistDto,
  ): Promise<IStandardResponse<IPlaylist>> {
    const playlist = await this.playlistService.update(playlistId, organizationId, body);
    return SendApiResponse('playlist updated', playlist);
  }

  /**
   * @summary Get playlist by id
   */
  @SuccessResponse('200')
  @Get('{organizationId}/{playlistId}')
  async getPlaylist(
    @Path() organizationId: string,
    @Path() playlistId: string,
  ): Promise<IStandardResponse<IPlaylist>> {
    const playlist = await this.playlistService.get(playlistId);
    if (playlist.organizationId.toString() !== organizationId) {
      throw new Error('Not authorized to access this playlist');
    }
    return SendApiResponse('playlist fetched', playlist);
  }

  /**
   * @summary Get all playlists for organization
   */
  @SuccessResponse('200')
  @Get('{organizationId}')
  async getOrganizationPlaylists(
    @Path() organizationId: string,
  ): Promise<IStandardResponse<Array<IPlaylist>>> {
    const playlists = await this.playlistService.getByOrganization(organizationId);
    return SendApiResponse('playlists fetched', playlists);
  }

  /**
   * @summary Delete playlist
   */
  @SuccessResponse('200')
  @Delete('{organizationId}/{playlistId}')
  async deletePlaylist(
    @Path() organizationId: string,
    @Path() playlistId: string,
  ): Promise<IStandardResponse<void>> {
    await this.playlistService.deleteOne(playlistId, organizationId);
    return SendApiResponse('playlist deleted');
  }
} 