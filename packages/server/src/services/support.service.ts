import { config } from '@config';
import BaseController from '@databases/storage';
import { ISupport } from '@interfaces/support.interface';
import Support from '@models/support.model';
import { Telegraf } from 'telegraf';

export default class SupportService {
  private path: string;
  private controller: BaseController<ISupport>;
  constructor() {
    this.path = 'support';
    this.controller = new BaseController<ISupport>('db', Support);
  }

  async create(data: ISupport): Promise<ISupport> {
    const bot = new Telegraf(config.telegram.apiKey);
    bot.telegram.sendMessage(config.telegram.chatId, data.message);
    return await this.controller.store.create(' ', data);
  }

  async getAll(): Promise<Array<ISupport>> {
    return await this.controller.store.findAll({}, this.path);
  }
}
