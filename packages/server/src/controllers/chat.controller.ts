import { CreateChatDto } from '@dtos/chat/create-chat.dto';
import { IChat } from '@interfaces/chat.interface';
import ChatService from '@services/chat.service';
import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Tags('Chat')
@Route('chats')
export class ChatController extends Controller {
  private chatService = new ChatService();

  /**
   * @summary Creates Chat
   */
  @Security('jwt')
  @SuccessResponse('201')
  @Post('')
  async createCHar(
    @Body() body: CreateChatDto
  ): Promise<IStandardResponse<IChat>> {
    const chat = await this.chatService.create(body);
    return SendApiResponse('chat created', chat);
  }

  /**
   * @summary Get all chats by stage
   */
  @SuccessResponse('200')
  @Get('{stageId}')
  async getChatStageById(
    @Path() stageId: string
  ): Promise<IStandardResponse<IChat[]>> {
    const chats = await this.chatService.getAllChatByStageId(stageId);
    return SendApiResponse('chats fetched', chats);
  }
}
