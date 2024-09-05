import { config } from '@config';
import { SessionType } from '@interfaces/session.interface';
import { google } from 'googleapis';
import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { generateId } from './util';
const { accountEmail, privateKey } = config.google;

const SPEAKER_SHEET = 'Speakers';
const SPEAKER_DATA_RANGE = 'A3:H';
const STAGE_SHEET = 'Stages';
const STAGE_DATA_RANGE = 'A2:D';
const SESSION_SHEET = 'Sessions';
const SESSION_DATA_RANGE = 'A3:N';

export default class GoogleSheetService {
  connection: any;
  constructor() {
    const serviceAccount = {
      client_email: accountEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    };
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    this.connection = google.sheets({
      version: 'v4',
      auth: jwtClient,
    });
  }
  async getDataForRange(
    sheetId: string,
    sheetName: string,
    range: string,
  ): Promise<any[]> {
    const response = await this.connection.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${range}`,
    });
    return response.data.values || [];
  }

  async appendData(
    sheetId: string,
    sheetName: string,
    values: any[],
  ): Promise<void> {
    try {
      await this.connection.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: sheetName,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error('Error appending data to Google Sheets:', error);
      throw error;
    }
  }

  async generateSpeakers(sheetId: string): Promise<
    Array<{
      name: string;
      bio: string;
      photo: string;
      twitter: string;
      slug: string;
    }>
  > {
    const data = await this.getDataForRange(
      sheetId,
      SPEAKER_SHEET,
      SPEAKER_DATA_RANGE,
    );
    const speakers = [];
    for (const row of data) {
      const [name, description, twitterHandle, avatar] = row;
      const speaker = {
        name,
        bio: description || 'No description',
        photo: avatar || 'No photo',
        twitter: twitterHandle,
        slug: generateId(name),
      };
      speakers.push(speaker);
    }
    return speakers;
  }

  async generateStages(
    sheetId: string,
    organisationId: string,
  ): Promise<
    Array<{
      _id: string;
      name: string;
      streamSettings: { streamId: string };
      organizationId: string;
      streamDate: string;
      slug: string;
    }>
  > {
    const data = await this.getDataForRange(
      sheetId,
      STAGE_SHEET,
      STAGE_DATA_RANGE,
    );
    const stages = [];
    for (const row of data) {
      const [name, streamId] = row;
      const stage = {
        _id: new Types.ObjectId().toString(),
        name,
        streamSettings: {
          streamId,
        },
        organisationId: organisationId,
        streamDate: new Date(),
        slug: generateId(name),
      };
      stages.push(stage);
    }
    return stages;
  }

  async generateSessions(
    sheetId: string,
    organizationId: string,
    stages: Array<{ _id: string; name: string; slug: string }>,
    speakers: Array<{
      name: string;
      bio: string;
      photo: string;
      twitter: string;
      slug: string;
    }>,
  ): Promise<any> {
    const data = await this.getDataForRange(
      sheetId,
      SESSION_SHEET,
      SESSION_DATA_RANGE,
    );
    const sessions = [];
    for (const row of data) {
      const [
        Name,
        Description,
        stageId,
        Day,
        Start,
        End,
        sessionType,
        ...speakerIdsRaw
      ] = row.slice(0, 11);
      const newDate = () => {
        const date = Day.split('/');
        return `${date[2]}-${date[1]}-${date[0]}`;
      };
      const stage = stages.find((s) => s.slug === generateId(stageId));
      if (!stage) continue;
      const speakersData = speakerIdsRaw
        .filter(Boolean)
        .map((id) => {
          const speakerSlug = generateId(id);
          const speaker = speakers.find((s) => s.slug === speakerSlug);
          return speaker;
        })
        .filter(Boolean);
      const session = {
        _id: new Types.ObjectId().toString(),
        name: Name,
        description: Description || 'No description',
        start: moment
          .tz(`${newDate()} ${Start}:00`, 'YYYY-MM-DD HH:mm:ss', 'UTC')
          .valueOf(),
        end: moment
          .tz(`${newDate()} ${End}:00`, 'YYYY-MM-DD HH:mm:ss', 'UTC')
          .valueOf(),
        slug: generateId(Name),
        organizationId: organizationId,
        type: SessionType.video,
        stageId: stage._id,
        speakers: speakersData,
        track: row[13] || 'No track',
        coverImage: row[17] || 'No cover image',
      };
      sessions.push(session);
    }
    return sessions;
  }

  async generateSessionsByStage(d: {
    sheetId: string;
    stageId: string;
    stageSlug: string;
    organizationId: string;
  }) {
    const data = await this.getDataForRange(
      d.sheetId,
      SESSION_SHEET,
      SESSION_DATA_RANGE,
    );
    const sessions = [];
    for (const row of data) {
      const [
        Name,
        Description,
        stage,
        Day,
        Start,
        End,
        sessionType,
        ...speakerIdsRaw
      ] = row.slice(0, 11);
      if (generateId(stage) !== d.stageSlug) continue;
      const newDate = () => {
        const date = Day.split('/');
        return `${date[2]}-${date[1]}-${date[0]}`;
      };
      const speakers = await this.generateSpeakers(d.sheetId);
      const speakersData = speakerIdsRaw
        .filter(Boolean)
        .map((id) => {
          const speakerSlug = generateId(id);
          const speaker = speakers.find((s) => s.slug === speakerSlug);
          return speaker;
        })
        .filter(Boolean);
      const session = {
        _id: new Types.ObjectId().toString(),
        name: Name,
        description: Description || 'No description',
        start: moment
          .tz(`${newDate()} ${Start}:00`, 'YYYY-MM-DD HH:mm:ss', 'UTC')
          .valueOf(),
        end: moment
          .tz(`${newDate()} ${End}:00`, 'YYYY-MM-DD HH:mm:ss', 'UTC')
          .valueOf(),
        slug: generateId(Name),
        organizationId: d.organizationId,
        type: SessionType.video,
        stageId: d.stageId,
        speakers: speakersData,
        track: row[13] || 'No track',
        coverImage: row[17] || 'No cover image',
      };
      sessions.push(session);
    }
    return sessions;
  }
}
