import BaseController from '@databases/storage';
import { IChat } from '@interfaces/chat.interface';
import Chat from '@models/chat.model';

export default class ChatService {
  private path: string;
  private controller: BaseController<IChat>;
  constructor() {
    this.path = 'chats';
    this.controller = new BaseController<IChat>('db', Chat);
  }

  async create(data: IChat): Promise<IChat> {
    return await this.controller.store.create(data.stageId.toString(), data);
  }

  async getAllChatByStageId(stageId: string): Promise<Array<IChat>> {
    return await this.controller.store.findAll({
      stageId: stageId,
    });
  }
}
