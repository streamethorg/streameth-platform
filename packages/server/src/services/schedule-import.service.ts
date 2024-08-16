import { SessionType } from '@interfaces/session.interface';
import ScheduleImport from '@models/schedule.model';
import Session from '@models/session.model';
import { generateId } from '@utils/util';
import { Types } from 'mongoose';
import fetch from 'node-fetch';
export default class ScheduleImporterService {
  async importData(data: {
    url: string;
    type: string;
    organizationId: string;
  }): Promise<any> {
    return this.pretalx(data.url, data.organizationId);
  }

  private async pretalx(url: string, organizationId: string): Promise<any> {
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
      };
    });
    let sessionss = [];
    for (const day of data.schedule.conference.days) {
      for (const [roomName, sessions] of Object.entries(day.rooms)) {
        console.log('sessions', sessions);
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
            description: session.description || '',
            start: new Date(session.date).getTime(),
            end: new Date().getTime(),
            slug: generateId(session.title),
            organizationId: organizationId,
            type: SessionType.video,
            stageId: room._id,
            speakers: speakers,
          };
          sessionss.push(sessionData);
        }
      }
    }
    return ScheduleImport.create({
      url,
      type: 'pretalx',
      status: 'completed',
      organizationId: organizationId,
      metadata: {
        rooms,
        sessions: sessionss,
      },
    });
  }
}
