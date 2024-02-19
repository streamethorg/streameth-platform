import Queue from 'bull';
import { connect, disconnect } from 'mongoose';
import { dbConnection } from './db';
import State from '@server/models/state.model';
import { StateType, StateStatus } from '@server/interfaces/state.interface';
import GSheetImporter from './providers/gsheet';
import PretalxImporter from './providers/pretalx';
import BaseImporter from './providers';
import { config } from './config';

class ImporterService {
  private queue: any;
  private syncQueue: any;

  constructor() {
    this.queue = new Queue('importer', config.redis.host);
    this.syncQueue = new Queue('sync-importer', config.redis.host);
    this.connectToDatabase();
    this.initializeImporter();
    this.initializeSyncImporter();
    this.scheduleImportJob();
    this.scheduleSyncJob();
  }

  private async initializeImporter(): Promise<void> {
    console.info('queue', await this.queue.getRepeatableJobs());
    //this.queue.obliterate({force: true})
    this.queue.process(async (job: any) => {
      try {
        let states = await State.find({
          type: StateType.event,
          status: StateStatus.pending,
        });
        if (states.length === 0) return;
        for (const state of states) {
          let controller = this.getImporterController(state.sheetType);
          let eventData = await controller.eventService.get(
            state.eventId.toString(),
          );
          let sheetId = eventData.dataImporter[0].config.sheetId
          let eventId = eventData._id.toString();
          await controller.generateSpeakers(sheetId, eventId);
          await controller.generateStages(sheetId, eventId);
          await controller.generateSessions({
            sheetId: sheetId,
            eventId: eventId.toString(),
            organizationId: eventData.organizationId.toString(),
            timezone: eventData.timezone,
          });
          await State.findByIdAndUpdate(state._id, {
            status: StateStatus.imported,
          });
        }
        console.info('done importing........');
      } catch (e) {
        console.error('error', e);
      }
    });
  }

  private async initializeSyncImporter(): Promise<void> {
    console.info('syncQueue', await this.queue.getRepeatableJobs());
    //this.syncQueue.obliterate({force: true})
    this.syncQueue.process(async (job: any) => {
      try {
        let states = await State.find({
          type: StateType.event,
          status: StateStatus.imported,
        });
        if (states.length === 0) return;
        for (const state of states) {
          let controller = this.getImporterController(state.sheetType);
          let eventData = await controller.eventService.get(
            state.eventId.toString(),
          );
          let sheetId = eventData.dataImporter[0].config.sheetId
          let eventId = eventData._id.toString();
          await controller.syncSpeakers(sheetId, eventId);
          await controller.syncStages(sheetId, eventId);
          await controller.syncSessions({
            sheetId: sheetId,
            eventId: eventId.toString(),
            organizationId: eventData.organizationId.toString(),
            timezone: eventData.timezone,
          });
        }
        console.info('done syncing........');
      } catch (e) {
        console.error('error', e);
      }
    });
  }

  private getImporterController(type: string) {
    let provider: BaseImporter;
    switch (type) {
      case 'gsheet':
        provider = new GSheetImporter();
        break;
      case 'pretalx':
        provider = new PretalxImporter();
        break;
      default:
        break;
    }
    return provider;
  }

  private scheduleImportJob(): void {
    this.queue.add(
      {},
      {
        attempts: 0,
        backoff: 30000,
        jobId: config.jobId,
        repeat: { cron: '*/5 * * * *' },
      },
    );
  }

  private scheduleSyncJob(): void {
    this.syncQueue.add(
      {},
      {
        attempts: 0,
        backoff: 30000,
        jobId: config.jobId,
        repeat: { cron: '*/10 * * * *' },
      },
    );
  }

  private async connectToDatabase() {
    await connect(dbConnection.url);
    console.info('Db connected');
  }

  async closeDatabaseConnection(): Promise<void> {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

export default new ImporterService();
