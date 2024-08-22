import { config } from '@config';
import BaseController from '@databases/storage';
import { ISupport } from '@interfaces/support.interface';
import Support from '@models/support.model';
import { Telegraf } from 'telegraf';

export default class SupportService {
  private path: string;
  private controller: BaseController;
  constructor() {
    this.path = 'support';
    this.controller = new BaseController<ISupport>('db', Support);
  }

  async create(data: ISupport): Promise {
    const bot = new Telegraf(config.telegram.apiKey);
    await bot.telegram.sendMessage(
      config.telegram.chatId,
      `Message: ${data.message}, Image: ${data.image ?? ''},  Sender Email: ${
        data.email ?? ''
      }, Sender Telegram: ${data.telegram ?? ''}`,
    );
    return await this.controller.store.create(' ', data);
  }

  async getAll(): Promise {
    return await this.controller.store.findAll({});
  }
}
