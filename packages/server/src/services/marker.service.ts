import BaseController from '@databases/storage';
import { IMarker } from '@interfaces/marker.interface';
import Markers from '@models/markers.model';
import GoogleSheetService from '@utils/google-sheet';
import { generateId } from '@utils/util';
import { Types } from 'mongoose';

export default class MarkerService {
  private path: string;
  private controller: BaseController<IMarker>;
  private googleSheetService = new GoogleSheetService();
  constructor() {
    this.path = 'markers';
    this.controller = new BaseController<IMarker>('db', Markers);
  }

  async create(data: IMarker): Promise<IMarker> {
    return await this.controller.store.create(data.name, data, this.path);
  }

  async update(markerId: string, marker: IMarker): Promise<IMarker> {
    return await this.controller.store.update(markerId, marker, marker.name);
  }

  async importMarkers(d: {
    url: string;
    type: string;
    organizationId: string;
  }): Promise<{ stages: Array<any>; markers: IMarker['metadata'] }> {
    if (d.type === 'gsheet') {
      return await this.gsheet(d.url, d.organizationId);
    }
    if (d.type === 'pretalx') {
      return await this.pretalx(d.url, d.organizationId);
    }
  }

  async getAll(organizationId: string): Promise<Array<IMarker>> {
    return await this.controller.store.findAll({ organizationId });
  }

  async deleteOne(markerId: string, subMarkerId: string): Promise<void> {
    await Markers.findOneAndUpdate(
      { _id: markerId },
      { $pull: { metadata: { _id: subMarkerId } } },
    );
  }

  private async gsheet(
    url: string,
    organizationId: string,
  ): Promise<{ stages: Array<any>; markers: IMarker['metadata'] }> {
    const sheetId = url.split('/')[5];
    const speakers = await this.googleSheetService.generateSpeakers(sheetId);
    const stages = await this.googleSheetService.generateStages(
      sheetId,
      organizationId,
    );
    const sessions = await this.googleSheetService.generateSessions(
      sheetId,
      organizationId,
      stages,
      speakers,
    );
    const markers = sessions.map((session) => {
      return {
        start: session.start,
        end: session.end,
        color: '#FFA500',
        title: session.title,
        description: session.description,
        speakers: session.speakers,
      };
    });
    return {
      stages,
      markers,
    };
  }

  private async pretalx(
    url: string,
    organizationId: string,
  ): Promise<{ stages: Array<any>; markers: IMarker['metadata'] }> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const rooms = data.schedule.conference.rooms.map((room: any) => {
      return {
        _id: new Types.ObjectId().toString(),
        name: room.name,
        slug: generateId(room.name),
        organizationId,
        streamDate: new Date(data.schedule.conference.start),
      };
    });
    let sessionsData = [];
    for (const day of data.schedule.conference.days) {
      for (const [roomName, sessions] of Object.entries(day.rooms)) {
        const room = rooms.find((r) => r.slug === generateId(roomName));
        if (!room) continue;
        for (const session of sessions as any[]) {
          const speakers = session.persons.map((person: any) => {
            return {
              name: person.public_name,
              bio: person.biography,
              photo: person.avatar,
            };
          });
          const sessionData = {
            name: session.title,
            description: session.description || 'No description',
            start: new Date(session.date).getTime(),
            end: new Date().getTime(),
            slug: generateId(session.title),
            organizationId: organizationId,
            speakers: speakers,
          };
          sessionsData.push(sessionData);
        }
      }
    }

    const markers = sessionsData.map((session) => {
      return {
        start: session.start,
        end: session.end,
        color: '#FFA500',
        title: session.title,
        description: session.description,
        speakers: session.speakers,
      };
    });
    return {
      stages: rooms,
      markers,
    };
  }
}
