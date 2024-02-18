import SpeakerService from '@server/services/speaker.service';
import SessionService from '@server/services/session.service';
import StageService from '@server/services/stage.service';
import EventService from '@server/services/event.service';
import crypto from 'crypto';

export interface IBaseImporter {
  generateSessions(data: any): Promise<void>;
  generateStages(sheetId: string, eventId: string): Promise<void>;
  generateSpeakers(sheetId: string, eventId: string): Promise<void>;
  syncSpeakers(sheetId: string, eventId: string): Promise<void>;
  syncStages(sheetId: string, eventId: string): Promise<void>;
  syncSessions(data: any): Promise<void>;
}

export default class BaseImporter implements IBaseImporter {
  speakerService: SpeakerService;
  stageService: StageService;
  sessionService: SessionService;
  eventService: EventService;

  constructor() {
    this.sessionService = new SessionService();
    this.stageService = new StageService();
    this.speakerService = new SpeakerService();
    this.eventService = new EventService();
  }

  async generateSessions(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async generateStages(sheetId: string, eventId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async generateSpeakers(sheetId: string, eventId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async syncSpeakers(sheetId: string, eventId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async syncStages(sheetId: string, eventId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async syncSessions(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  generateId(key: string): string {
    return key
      ?.trim()
      .replace(/\s/g, '_')
      .replace(/[^\w\s]/g, '')
      .toLowerCase();
  }
  generateHash(data: any, key: string): string {
    const hash = crypto
      .createHmac('sha512', key)
      .update(JSON.stringify(data))
      .digest('hex');
    return hash;
  }

  compareHash(data: any, key: string, previousHash): boolean {
    const hash = crypto
      .createHmac('sha512', key)
      .update(JSON.stringify(data))
      .digest('hex');
    return hash === previousHash;
  }
}
