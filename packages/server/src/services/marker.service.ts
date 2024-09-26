import BaseController from '@databases/storage';
import { HttpException } from '@exceptions/HttpException';
import { IMarker } from '@interfaces/marker.interface';
import Markers from '@models/markers.model';
import Stage from '@models/stage.model';
import GoogleSheetService from '@utils/google-sheet';
import { formatDate, generateId, getStartAndEndTime } from '@utils/util';
import e from 'express';
import fs from 'fs';

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
    stageId: string;
  }): Promise<Array<IMarker>> {
    const stage = await Stage.findById(d.stageId);
    if (!stage) throw new HttpException(404, 'Stage not found');
    if (d.type === 'pretalx') {
      return this.pretalx({
        url: d.url,
        roomId: stage.slug,
        organizationId: d.organizationId,
        stageId: d.stageId,
      });
    }
    if (d.type === 'gsheet') {
      return this.gsheet({
        url: d.url,
        organizationId: d.organizationId,
        stageId: d.stageId,
        stageSlug: stage.slug,
      });
    }
  }

  async getAll(d: {
    organization: string;
    stageId: string;
    date: string;
  }): Promise<Array<IMarker>> {
    let filter = {};
    if (d.date !== undefined) {
      filter = { ...filter, date: d.date };
    }
    return await this.controller.store.findAll(
      { organizationId: d.organization, stageId: d.stageId, ...filter },
      {},
      this.path,
      0,
      0,
    );
  }

  async deleteOne(markerId: string): Promise<void> {
    await Markers.findByIdAndDelete(markerId);
  }

  private async gsheet(d: {
    url: string;
    organizationId: string;
    stageId: string;
    stageSlug: string;
  }): Promise<Array<IMarker>> {
    const sheetId = d.url.split('/')[5];
    const stages = await this.googleSheetService.generateStages(
      sheetId,
      d.organizationId,
    );

    let sessions = [];
    if (stages.length > 1) {
      sessions = await this.googleSheetService.generateSessionsByStage({
        sheetId,
        stageId: d.stageId,
        stageSlug: d.stageSlug,
        organizationId: d.organizationId,
      });
    } else if (stages.length === 1) {
      sessions = await this.googleSheetService.generateSessionsByStage({
        sheetId,
        stageId: d.stageId,
        stageSlug: stages[0].slug,
        organizationId: d.organizationId,
      });
    }
    // formatting startClipTime and endClipTime to video timeline in secs
    const sortedSessions = sessions.sort((a, b) => a.start - b.start);
    const firstSessionStart = sortedSessions[0].start;

    const markers = sortedSessions.map((session, index) => {
      let startClipTime: number;
      let endClipTime: number;

      if (index === 0) {
        // Ensure the first session always starts at 0 seconds
        startClipTime = 0;
        endClipTime = (session.end - session.start) / 1000;
      } else {
        startClipTime = (session.start - firstSessionStart) / 1000;
        endClipTime = (session.end - firstSessionStart) / 1000;
      }

      return {
        name: session.name,
        description: session.description,
        organizationId: d.organizationId,
        start: session.start,
        end: session.end,
        date: session.day,
        speakers: session.speakers,
        slug: session.slug,
        stageId: d.stageId,
        startClipTime,
        endClipTime,
      };
    });

    return await Markers.create(markers);
  }

  private async pretalx(d: {
    url: string;
    roomId: string;
    organizationId: string;
    stageId: string;
  }): Promise<Array<IMarker>> {
    const response = await fetch(d.url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    let markersData = [];
    let roomCount = 0;

    for (const day of data.schedule.conference.days) {
      roomCount += Object.keys(day.rooms).length;
      for (const [roomName, sessions] of Object.entries(day.rooms)) {
        const shouldImportRoom =
          roomCount === 1 || generateId(roomName) === d.roomId;
        if (!shouldImportRoom) continue;

        const sortedSessions = (sessions as any[]).sort(
          (a, b) =>
            new Date(a.date + 'T' + a.start).getTime() -
            new Date(b.date + 'T' + b.start).getTime(),
        );
        const firstSessionStart = new Date(
          sortedSessions[0].date + 'T' + sortedSessions[0].start,
        ).getTime();

        sortedSessions.forEach((session, index) => {
          const speakers = session.persons.map((person: any) => {
            return {
              name: person.public_name,
              bio: person.biography,
              photo: person.avatar,
              organizationId: d.organizationId,
            };
          });
          const sessionTime = getStartAndEndTime(
            session.date,
            session.start,
            session.duration,
          );
          // formatting startClipTime and endClipTime to video timeline in secs
          let startClipTime: number;
          let endClipTime: number;

          if (index === 0) {
            startClipTime = 0;
            endClipTime = (sessionTime.end - sessionTime.start) / 1000;
          } else {
            startClipTime = (sessionTime.start - firstSessionStart) / 1000;
            endClipTime = (sessionTime.end - firstSessionStart) / 1000;
          }

          const markerData = {
            name: session.title,
            description: session.description,
            organizationId: d.organizationId,
            start: sessionTime.start,
            end: sessionTime.end,
            date: formatDate(session.date),
            speakers: speakers,
            slug: generateId(session.title),
            stageId: d.stageId,
            startClipTime,
            endClipTime,
          };
          markersData.push(markerData);
        });
      }
    }

    return await Markers.create(markersData);
  }
}
