import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IPlaylist, IPlaylistCreate, IPlaylistUpdate } from '@interfaces/playlist.interface';
import Playlist from '@models/playlist.model';
import { Types } from 'mongoose';

export default class PlaylistService {
  private path: string;
  private controller: BaseController<IPlaylist>;

  constructor() {
    this.path = 'playlists';
    this.controller = new BaseController<IPlaylist>('db', Playlist);
  }

  async create(organizationId: string, data: IPlaylistCreate): Promise<IPlaylist> {
    const playlistData = {
      ...data,
      organizationId: new Types.ObjectId(organizationId),
      sessions: data.sessions.map(id => new Types.ObjectId(id)),
      isPublic: data.isPublic ?? false,
    };

    const createPlaylist = await this.controller.store.create(
      playlistData.name,
      playlistData,
      this.path,
    );

    return createPlaylist;
  }

  async update(
    playlistId: string,
    organizationId: string,
    playlistUpdate: IPlaylistUpdate,
  ): Promise<IPlaylist> {
    const playlist = await this.get(playlistId);
    if (!playlist) {
      throw new HttpException(404, 'Playlist not found');
    }

    if (playlist.organizationId.toString() !== organizationId) {
      throw new HttpException(403, 'Not authorized to update this playlist');
    }

    const updateData = {
      ...playlistUpdate,
      sessions: playlistUpdate.sessions?.map(id => new Types.ObjectId(id)),
    };

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedPlaylist) {
      throw new HttpException(404, 'Failed to update playlist');
    }

    return updatedPlaylist;
  }

  async get(playlistId: string): Promise<IPlaylist> {
    const playlist = await this.controller.store.findById(playlistId);
    if (!playlist) throw new HttpException(404, 'Playlist not found');
    return playlist;
  }

  async getByOrganization(organizationId: string): Promise<Array<IPlaylist>> {
    return await this.controller.store.findAll({ organizationId });
  }

  async deleteOne(playlistId: string, organizationId: string): Promise<void> {
    const playlist = await this.get(playlistId);
    if (playlist.organizationId.toString() !== organizationId) {
      throw new HttpException(403, 'Not authorized to delete this playlist');
    }
    return await this.controller.store.delete(playlistId);
  }
} 