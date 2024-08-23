import { HttpException } from '@exceptions/HttpException';
import {
  ImportStatus,
  IScheduleImporter,
} from '@interfaces/schedule-importer.interface';
import { SessionType } from '@interfaces/session.interface';
import ScheduleImport from '@models/schedule.model';
import Stage from '@models/stage.model';
import { generateId } from '@utils/util';
import { Types } from 'mongoose';
import fetch from 'node-fetch';
import SessionService from './session.service';
import StageService from './stage.service';
export default class ScheduleImporterService {
  private stageService = new StageService();
  private sessionService = new SessionService();

  async importSessionsAndStage(data: {
    url: string;
    type: string;
    organizationId: string;
  }): Promise<any> {
    return this.pretalx(data.url, data.organizationId);
  }

  async importByStage(data: {
    stageId: string;
    url: string;
    type: string;
    organizationId: string;
  }): Promise<void> {
    const stage = await Stage.findById(data.stageId);
    if (!stage) throw new HttpException(404, 'Stage not found');
    return this.pretalxStage({
      url: data.url,
      roomId: stage.slug,
      organizationId: data.organizationId,
      stageId: data.stageId,
    });
  }

  async save(scheduleId: string): Promise<void> {
    const schedule = await ScheduleImport.findById(scheduleId);
    if (!schedule) throw new HttpException(404, 'Schedule not found');
    if (schedule.metadata.stages.length !== 0) {
      for (const stage of schedule.metadata.stages) {
        await this.stageService.create({
          _id: stage._id,
          name: stage.name,
          organizationId: schedule.organizationId,
          slug: stage.slug,
          streamDate: stage.streamDate,
        });
      }
    }
    if (schedule.metadata.sessions.length !== 0) {
      for (const session of schedule.metadata.sessions) {
        await this.sessionService.create({
          _id: session._id,
          name: session.name,
          description: session.description || 'No description',
          start: session.start,
          end: session.end,
          slug: session.slug,
          organizationId: session.organizationId,
          type: session.type,
          stageId: session.stageId,
          speakers: session.speakers,
        });
      }
    }
    await schedule.updateOne(
      { status: ImportStatus.completed },
      { upsert: true },
    );
  }

  private async pretalxStage(d: {
    url: string;
    roomId: string;
    organizationId: string;
    stageId: string;
  }): Promise<any> {
    const response = await fetch(d.url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    let sessionsData = [];
    for (const day of data.schedule.conference.days) {
      for (const [roomName, sessions] of Object.entries(day.rooms)) {
        const room = generateId(roomName) === d.roomId;
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
            organizationId: d.organizationId,
            type: SessionType.video,
            stageId: d.stageId,
            speakers: speakers,
          };
          sessionsData.push(sessionData);
        }
      }
    }
    return ScheduleImport.create({
      url: d.url,
      type: 'pretalx',
      status: 'pending',
      organizationId: d.organizationId,
      metadata: {
        stages: [],
        sessions: sessionsData,
      },
    });
  }

  private async pretalx(
    url: string,
    organizationId: string,
  ): Promise<IScheduleImporter> {
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
        organizationId: organizationId,
        streamDate: new Date(data.schedule.conference.start),
      };
    });
    let sessionsData = [];
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
          sessionsData.push(sessionData);
        }
      }
    }
    return ScheduleImport.create({
      url,
      type: 'pretalx',
      status: 'pending',
      organizationId: organizationId,
      metadata: {
        stages: rooms,
        sessions: sessionsData,
      },
    });
  }
}