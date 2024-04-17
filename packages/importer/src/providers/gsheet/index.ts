import BaseImporter from '../index';
import GoogleSheetService from './google-sheet';
import moment from 'moment-timezone';
import { config } from '../../config';

const SPEAKER_SHEET = 'Speakers';
const SPEAKER_DATA_RANGE = 'A3:H';
const STAGE_SHEET = 'Stages';
const STAGE_DATA_RANGE = 'A2:D';
const SESSION_SHEET = 'Sessions';
const SESSION_DATA_RANGE = 'A3:N';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export default class GSheetImporter extends BaseImporter {
  private googleSheetService = new GoogleSheetService();

  async generateSpeakers(sheetId: string, eventId: string): Promise<void> {
    console.info('importing speakers.......');
    const data = await this.googleSheetService.getDataForRange(
      sheetId,
      SPEAKER_SHEET,
      SPEAKER_DATA_RANGE,
    );
    for (const [index, row] of data.entries()) {
      const [name, description, twitterHandle, avatar] = row;
      const speaker = {
        name,
        bio: description || 'No description',
        photo: avatar || undefined,
        twitter: twitterHandle,
        eventId: eventId,
        organizationId: '',
      };
      try {
        const hash = this.generateHash(speaker, config.secretKey);
        const createSpeaker = await this.speakerService.create(speaker);
        const updateRange = `${SPEAKER_SHEET}!G${index + 3}:H${index + 3}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [
          createSpeaker._id.toString(),
          hash,
        ]);
        sleep(3000);
      } catch (e) {
        console.error(`Error creating speaker:`, speaker, e);
      }
    }
  }

  async generateStages(sheetId: string, eventId: string): Promise<void> {
    console.info('importing stages.......');
    const data = await this.googleSheetService.getDataForRange(
      sheetId,
      STAGE_SHEET,
      STAGE_DATA_RANGE,
    );
    for (const [index, row] of data.entries()) {
      const [name, streamId] = row;
      const stage = {
        name,
        eventId: eventId,
        streamSettings: {
          streamId,
        },
        organizationId: '',
      };

      try {
        const hash = this.generateHash(stage, config.secretKey);
        const createStage = await this.stageService.create(stage);
        const updateRange = `${STAGE_SHEET}!E${index + 2}:F${index + 2}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [
          createStage._id.toString(),
          hash,
        ]);
        sleep(3000);
      } catch (e) {
        console.error(`Error creating stage:`, stage, e);
      }
    }
  }

  async generateSessions(d: {
    sheetId: string;
    eventId: string;
    eventSlug: string;
    organizationId: string;
    timezone: string;
  }): Promise<void> {
    console.log('importing sessions.....');
    const sheetId = d.sheetId;
    const eventId = d.eventId;
    const organizationId = d.organizationId;

    const data = await this.googleSheetService.getDataForRange(
      sheetId,
      SESSION_SHEET,
      SESSION_DATA_RANGE,
    );
    for (const [index, row] of data.entries()) {
      try {
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
        const speakerPromises = speakerIdsRaw
          .filter(Boolean)
          .map((speakerId: string) =>
            this.speakerService.findSpeakerForEvent(
              this.generateId(speakerId),
              eventId,
            ),
          );
        const [speakers, stage] = await Promise.all([
          Promise.all(speakerPromises),
          this.stageService.findStageForEvent(
            this.generateId(stageId),
            eventId,
          ),
        ]);
        const newDate = () => {
          const date = Day.split('/');
          return `${date[2]}-${date[1]}-${date[0]}`;
        };
        const session = {
          name: Name,
          description: Description,
          stageId: stage._id,
          eventId: eventId,
          eventSlug: d.eventSlug,
          organizationId: organizationId,
          speakers: speakers,
          start: moment
            .tz(`${newDate()} ${Start}:00`, 'YYYY-MM-DD HH:mm:ss', d.timezone)
            .valueOf(),
          end: moment
            .tz(`${newDate()} ${End}:00`, 'YYYY-MM-DD HH:mm:ss', d.timezone)
            .valueOf(),
          track: row[13],
          coverImage: row[17],
          // moderator: row[12],
        };
        const hash = this.generateHash(session, config.secretKey);
        const createSession = await this.sessionService.create(session);
        const updateRange = `${SESSION_SHEET}!S${index + 3}:T${index + 3}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [
          createSession._id.toString(),
          hash,
        ]);
        sleep(3000);
      } catch (e) {
        console.error(`Error creating session:`, e);
      }
    }
  }

  async syncSpeakers(sheetId: string, eventId: string): Promise<void> {
    console.info('syncing speakers.......');
    const [data, extraData] = await Promise.all([
      this.googleSheetService.getDataForRange(
        sheetId,
        SPEAKER_SHEET,
        SPEAKER_DATA_RANGE,
      ),
      this.googleSheetService.getDataForRange(sheetId, SPEAKER_SHEET, 'G3:H'),
    ]);
    for (const [index, row] of data.entries()) {
      const [name, description, twitterHandle, avatar] = row;
      const [speakerId, previousHash] = extraData[index];
      const speaker = {
        name,
        bio: description || 'No description',
        photo: avatar || undefined,
        twitter: twitterHandle,
        eventId: eventId,
        organizationId: '',
      };
      const compareHash = this.compareHash(
        speaker,
        config.secretKey,
        previousHash,
      );
      if (compareHash) continue;
      if (speakerId == undefined) {
        await this.createSpeaker(speaker, index, sheetId);
        continue;
      }
      try {
        const hash = this.generateHash(speaker, config.secretKey);
        await this.speakerService.update(speakerId, speaker);
        const updateRange = `${SPEAKER_SHEET}!H${index + 3}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [hash]);
        sleep(3000);
      } catch (e) {
        console.error(`Error updating speaker:`, speaker, e);
      }
    }
  }

  async syncStages(sheetId: string, eventId: string): Promise<void> {
    console.info('syncing stages.......');
    const [data, extraData] = await Promise.all([
      this.googleSheetService.getDataForRange(
        sheetId,
        STAGE_SHEET,
        STAGE_DATA_RANGE,
      ),
      this.googleSheetService.getDataForRange(sheetId, STAGE_SHEET, 'E2:F'),
    ]);
    for (const [index, row] of data.entries()) {
      const [name, streamId] = row;
      const [stageId, previousHash] = extraData[index];
      const stage = {
        name,
        eventId: eventId,
        streamSettings: {
          streamId,
        },
        organizationId: '',
      };
      const compareHash = this.compareHash(
        stage,
        config.secretKey,
        previousHash,
      );
      if (compareHash) continue;
      try {
        const hash = this.generateHash(stage, config.secretKey);
        await this.stageService.update(stageId, stage);
        const updateRange = `${STAGE_SHEET}!F${index + 2}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [hash]);
        sleep(3000);
      } catch (e) {
        console.error(`Error updating stage:`, stage, e);
      }
    }
  }

  async syncSessions(d: {
    sheetId: string;
    eventId: string;
    eventSlug: string;
    organizationId: string;
    timezone: string;
  }): Promise<void> {
    console.log('syncing sessions.....');
    const sheetId = d.sheetId;
    const eventId = d.eventId;
    const organizationId = d.organizationId;

    const [data, extraData] = await Promise.all([
      await this.googleSheetService.getDataForRange(
        sheetId,
        SESSION_SHEET,
        SESSION_DATA_RANGE,
      ),
      await this.googleSheetService.getDataForRange(
        sheetId,
        SESSION_SHEET,
        'S3:T',
      ),
    ]);
    for (const [index, row] of data.entries()) {
      const [sessionId, previousHash] = extraData[index];
      try {
        const [
          Name,
          Description,
          stageId,
          Day,
          Start,
          sessionType,
          End,
          ...speakerIdsRaw
        ] = row.slice(0, 11);
        const speakerPromises = speakerIdsRaw
          .filter(Boolean)
          .map((speakerId: string) =>
            this.speakerService.findSpeakerForEvent(
              this.generateId(speakerId),
              eventId,
            ),
          );
        const [speakers, stage] = await Promise.all([
          Promise.all(speakerPromises),
          this.stageService.findStageForEvent(
            this.generateId(stageId),
            eventId,
          ),
        ]);
        const newDate = () => {
          const date = Day.split('/');
          return `${date[2]}-${date[1]}-${date[0]}`;
        };
        const session = {
          name: Name,
          description: Description,
          stageId: stage._id,
          eventId: eventId,
          eventSlug: d.eventSlug,
          organizationId: organizationId,
          speakers: speakers,
          start: moment
            .tz(`${newDate()} ${Start}:00`, 'YYYY-MM-DD HH:mm:ss', d.timezone)
            .valueOf(),
          end: moment
            .tz(`${newDate()} ${End}:00`, 'YYYY-MM-DD HH:mm:ss', d.timezone)
            .valueOf(),
          track: row[13],
          coverImage: row[17],
          // moderator: row[12],
        };
        const compareHash = this.compareHash(
          session,
          config.secretKey,
          previousHash,
        );
        if (compareHash) continue;
        if (sessionId == undefined) {
          await this.createSession(session, index, sheetId);
          continue;
        }
        const hash = this.generateHash(session, config.secretKey);
        const findSession = await this.sessionService.get(sessionId);
        await this.sessionService.update(sessionId, {
          ...session,
          assetId: findSession.assetId,
          playbackId: findSession.playbackId,
        });
        const updateRange = `${SESSION_SHEET}!T${index + 3}`;
        await this.googleSheetService.appendData(sheetId, updateRange, [hash]);
        sleep(3000);
      } catch (e) {
        console.error(`Error updating session:`, e);
      }
    }
  }
  private async createSession(
    sessionData: any,
    index: number,
    sheetId: string,
  ) {
    const hash = this.generateHash(sessionData, config.secretKey);
    const createSession = await this.sessionService.create(sessionData);
    const updateRange = `${SESSION_SHEET}!S${index + 3}:T${index + 3}`;
    await this.googleSheetService.appendData(sheetId, updateRange, [
      createSession._id.toString(),
      hash,
    ]);
  }

  private async createSpeaker(
    speakerData: any,
    index: number,
    sheetId: string,
  ) {
    const hash = this.generateHash(speakerData, config.secretKey);
    const createSpeaker = await this.speakerService.create(speakerData);
    const updateRange = `${SPEAKER_SHEET}!G${index + 3}:H${index + 3}`;
    await this.googleSheetService.appendData(sheetId, updateRange, [
      createSpeaker._id.toString(),
      hash,
    ]);
  }
}
